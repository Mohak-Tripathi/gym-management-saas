// src/database/communityPost.database.ts
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { deleteImageFromS3, uploadImageToS3 } from "../utils/s3";
import { getPresignedImageUrl } from "../utils/getPresignedImageUrl";

const prisma = new PrismaClient();




export class CommunityPostDatabase {
  static async create(data: any, files?: Express.Multer.File[]) {
    try {
      const { gymId, gymBranchId, userId, title, content, category, isPinned = false } = data;

      if (!gymId || !gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "COMMUNITY_POST_GYM_BRANCH_ID_REQUIRED"
        );
      }

      // Upload all images to S3
      let imagesData: any[] = [];
      if (files && files.length > 0) {
        imagesData = await Promise.all(
          files.map(async (file) => {
            const { key, name, mime } = await uploadImageToS3(file, "muscletech-community-post-images");
            return {
              imageUrl: key,
              imageName: name,
              mimeType: mime,
            };
          })
        );
      }

      // Create post with image relation
      const post = await prisma.communityPost.create({
        data: {
          title,
          content,
          category,
          isPinned,
          gymId,
          gymBranchId,
          userId,
          images: {
            createMany: {
              data: imagesData,
            },
          },
        },
        include: {
          images: true, // return post with its images
        },
      });

      return post;

    } catch (error) {
      console.error(error, "COMMUNITY_POST_DB_CREATE_ERROR");
      throw new AppError(
        "Error creating community post",
        500,
        "COMMUNITY_POST_DB_CREATE_ERROR"
      );
    }
  }



  // static async getAll(gymId: string, branchId: string) {
  //   try {

  //     if (!gymId || !branchId) {
  //       throw new AppError(
  //         "Gym ID and Branch ID are required",
  //         400,
  //         "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
  //       );
  //     }

  //     return await prisma.communityPost.findMany({
  //       where: { 
  //         gymId,
  //         gymBranchId:branchId
  //       },
  //       // include: {
  //       //   postedBy: true,
  //       // },
  //       orderBy: { createdAt: "desc" },
  //     });
  //   } catch (error) {
  //     console.log(error, "getAllError")
  //     throw new AppError(
  //       "Error fetching community posts",
  //       500,
  //       "COMMUNITY_POST_DB_FETCH_ALL_ERROR"
  //     );
  //   }
  // }





  static async getAll(gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "COMMUNITY_POST_GYM_BRANCH_ID_REQUIRED"
        );
      }

      const posts = await prisma.communityPost.findMany({
        where: {
          gymId,
          gymBranchId: branchId,
        },
        include: {
          images: true,
          user: true, // optional: include postedBy info
        },
        orderBy: { createdAt: "desc" },
      });

      const processedPosts = await Promise.all(
        posts.map(async (post) => {
          const imagesWithUrls = await Promise.all(
            post.images.map(async (img:any) => {
              const presignedUrl = await getPresignedImageUrl(img.imageUrl);
              return {
                ...img,
                imageUrl: presignedUrl,
              };
            })
          );

          return {
            ...post,
            images: imagesWithUrls,
          };
        })
      );

      return processedPosts;

    } catch (error) {
      console.log(error, "COMMUNITY_POST_DB_FETCH_ALL_ERROR");
      throw new AppError(
        "Error fetching community posts",
        500,
        "COMMUNITY_POST_DB_FETCH_ALL_ERROR"
      );
    }
  }



  // static async getById(id: string, gymId: string, branchId: string) {
  //   try {

  //     if (!gymId || !branchId) {
  //       throw new AppError(
  //         "Gym ID and Branch ID are required",
  //         400,
  //         "COMMUNITY_POST_DB_GYM_BRANCH_ID_REQUIRED"
  //       );
  //     }

  //     return await prisma.communityPost.findUnique({
  //       where: { 
  //         id,
  //         gymId,
  //         gymBranchId:branchId
  //       }
  //       // where: { id }
  //       // include: {
  //       //   postedBy: true,
  //       // },
  //     });
  //   } catch (error) {
  //     console.log(error, "getByIdError")
  //     throw new AppError(
  //       `Error fetching post with ID: ${id}`,
  //       500,
  //       "COMMUNITY_POST_DB_FETCH_BY_ID_ERROR"
  //     );
  //   }
  // }






  static async getById(id: string, gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "COMMUNITY_POST_DB_GYM_BRANCH_ID_REQUIRED"
        );
      }
  
      const post = await prisma.communityPost.findFirst({
        where: {
          id,
          gymId,
          gymBranchId: branchId,
        },
        include: {
          images: true,
          user: true, // optional: postedBy info
        },
      });
  
      if (!post) {
        throw new AppError(
          `Community post not found with ID: ${id}`,
          404,
          "COMMUNITY_POST_NOT_FOUND"
        );
      }
  
      const imagesWithPresignedUrls = await Promise.all(
        post.images.map(async (img) => {
          const presignedUrl = await getPresignedImageUrl(img.imageUrl);
          return {
            ...img,
            imageUrl: presignedUrl,
          };
        })
      );
  
      return {
        ...post,
        images: imagesWithPresignedUrls,
      };
    } catch (error) {
      console.log(error, "getByIdError");
      throw new AppError(
        `Error fetching post with ID: ${id}`,
        500,
        "COMMUNITY_POST_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  // static async update(id: string, data: any, files?: Express.Multer.File[]) {
  //   try {
  //     if (!data.gymId || !data.gymBranchId) {
  //       throw new AppError(
  //         "Gym ID and Branch ID are required",
  //         400,
  //         "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
  //       );
  //     }
  //     return await prisma.communityPost.update({
  //       where: { 
  //         id,
  //         gymId: data.gymId,
  //         gymBranchId:data.gymBranchId
 
  //       },
  //       data

  //       // include: {
  //       //   postedBy: true,
  //       // },
  //     });
  //   } catch (error) {
  //     console.log(error, "getByIdUpdateError")
  //     throw new AppError(
  //       `Error updating post with ID: ${id}`,
  //       500,
  //       "COMMUNITY_POST_DB_UPDATE_ERROR"
  //     );
  //   }
  // }






  static async update(
    id: string,
    data: any,
    files?: Express.Multer.File[]
  ) {
    try {
      if (!data.gymId || !data.gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "COMMUNITY_POST_DB_GYM_BRANCH_ID_REQUIRED"
        );
      }
  
      // Fetch the post with its images
      const existingPost = await prisma.communityPost.findFirst({
        where: {
          id,
          gymId: data.gymId,
          gymBranchId: data.gymBranchId
        },
        include: {
          images: true,
        },
      });
  
      if (!existingPost) {
        throw new AppError("Community post not found", 404, "COMMUNITY_POST_NOT_FOUND");
      }
  
      // Delete existing images from S3 and DB
      // for (const img of existingPost.images) {
      //   await deleteImageFromS3(img.imageName); // You must implement this
      // }

      for (const img of existingPost.images) {
        await deleteImageFromS3(img.imageUrl); // ✅ Use the key stored in imageUrl
      }
  
      await prisma.communityPostImage.deleteMany({
        where: {
          communityPostId: id,
        },
      });
  
      // Upload new images (if any) and create metadata entries
      if (files && files.length > 0) {
        const newImages = await Promise.all(
          files.map(async (file) => {
            const s3Response = await uploadImageToS3(file, "muscletech-community-post-images"); // Returns { url, key, contentType }
  
            return prisma.communityPostImage.create({
              data: {
                imageUrl: s3Response.key,
                imageName: s3Response.name,
                mimeType: s3Response.mime,
                communityPostId: id,
              },
            });
          })
        );
      }
  
      // Update post details (not images)
      return await prisma.communityPost.update({
        where: {
          id,
          gymId: data.gymId,
          gymBranchId: data.gymBranchId,
        },
        data: {
          title: data.title,
          content: data.content,
          category: data.category,
          isPinned: data.isPinned,
        },
        include: {
          images: true,
        },
      });
    } catch (error) {
      console.log(error, "COMMUNITY_POST_DB_UPDATE_ERROR");
      throw new AppError(
        `Error updating post with ID: ${id}`,
        500,
        "COMMUNITY_POST_DB_UPDATE_ERROR"
      );
    }
  }
  
//   static async delete(id: string, gymId: string, branchId: string) {
//     try {

//       if (!gymId || !branchId) {
//         throw new AppError(
//           "Gym ID and Branch ID are required",
//           400,
//           "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
//         );
//       }
//       return await prisma.communityPost.delete({
//         where: { 
//           id,
//           gymId,
//           gymBranchId: branchId
//         }
//         // where: { id } 
//       });
//     } catch (error) {
//       console.log(error, "getByIdDeleteError")
//       throw new AppError(
//         `Error deleting post with ID: ${id}`,
//         500,
//         "COMMUNITY_POST_DB_DELETE_ERROR"
//       );
//     }
//   }



static async delete(id: string, gymId: string, branchId: string) {
  try {
    if (!gymId || !branchId) {
      throw new AppError(
        "Gym ID and Branch ID are required",
        400,
        "MEMBERSHIP_DB_GYM_BRANCH_ID_REQUIRED"
      );
    }

    // 1. Get the post with images
    const post = await prisma.communityPost.findFirst({
      where: {
        id,
        gymId,
        gymBranchId: branchId,
      },
      include: {
        images: true,
      },
    });

    if (!post) {
      throw new AppError("Post not found", 404, "COMMUNITY_POST_NOT_FOUND");
    }

    // 2. Delete images from S3
    for (const img of post.images) {
      await deleteImageFromS3(img.imageUrl); // imageUrl = key
    }

    // 3. Delete image records from DB
    await prisma.communityPostImage.deleteMany({
      where: {
        communityPostId: id,
      },
    });

    // 4. Delete the post itself
    return await prisma.communityPost.delete({
      where: {
        id,
        gymId,
        gymBranchId: branchId,
      },
    });
  } catch (error) {
    console.log(error, "COMMUNITY_POST_DB_DELETE_ERROR");
    throw new AppError(
      `Error deleting post with ID: ${id}`,
      500,
      "COMMUNITY_POST_DB_DELETE_ERROR"
    );
  }
}

}
