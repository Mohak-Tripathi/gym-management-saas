import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import { deleteImageFromS3, uploadImageToS3 } from "../utils/s3";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const prisma = new PrismaClient();


const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


export class EquipmentDatabase {
  static async create(data: any, file?: Express.Multer.File) {
    try {
      if (!data.gymId || !data.gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "GYM_EQUIPMENT_GYM_BRANCH_ID_REQUIRED"
        );
      }

      let imageData = {};
      if (file) {
        // const { key, name: originalName, mime } = await uploadImageToS3(file);
        const { key, name: originalName, mime } = await uploadImageToS3(file, 'Muscletech-equipment-images');
        imageData = {
          imageUrl: key,
          imageName: originalName,
          mimeType: mime,
        };
      }
      
      return await  prisma.equipment.create({ data : { ...data, ...imageData } });
    } catch (error) {
      console.error("Gym Equipment Create Error:", error);
      throw new AppError(
        "Error creating Gym Equipment",
        500,
        "GYM_EQUIPMENT_DB_CREATE_ERROR"
      );
    }
  }

  static async getAll(gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "GYM_EQUIPMENT_GYM_BRANCH_ID_REQUIRED"
        );
      }

      const equipments = await prisma.equipment.findMany({
        where: {
          gymId,
          gymBranchId: branchId,
            },
            include: {
              gym: {
                select: {
                  id: true,
                  name: true,
                },
              },
              gymBranch: {
                select: {
                  id: true,
                  name: true,
                  address: true,
                },
              },
              maintenanceLogs: {
                select: {
                  id: true,
                  maintenanceDate: true,
                  status: true,
                  comments: true,
                },
              },
            },
            orderBy: {
              updatedAt: 'desc', // Most recently updated or created users appear first
            }
          })

          const processedEquipments = await Promise.all(
            equipments.map(async (equipment) => {
              let imageUrl = equipment.imageUrl;
              
              if (imageUrl) {
                const command = new GetObjectCommand({
                  Bucket: process.env.S3_BUCKET_NAME!,
                  Key: imageUrl,
                });

                imageUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 }); // 1 hour
              }

              return {
                ...equipment,
                imageUrl,
              };
            })
          )   
          
    return processedEquipments;
    } catch (error) {
      console.error("Gym Equipment Fetch All Error:", error);
      throw new AppError(
        "Error fetching CRM leads",
        500,
        "GYM_EQUIPMENT_DB_FETCH_ALL_ERROR"
      );
    }
  }

  static async getById(id: string, gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "GYM_EQUIPMENT_GYM_BRANCH_ID_REQUIRED"
        );
      }

      const equipment = await prisma.equipment.findFirst({
        where: {
          id,
          gymId,
          gymBranchId: branchId,
        },
        // include: {
        // //   gym: true,
        // //   gymBranch: true,
        // },
        include: {
            gym: {
              select: {
                id: true,
                name: true,
              },
            },
            gymBranch: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
            maintenanceLogs: {
              select: {
                id: true,
                maintenanceDate: true,
                status: true,
                comments: true,
              },
            },
          },
      });


      if (!equipment) {
        throw new AppError(
          `Equipment with ID ${id} not found`,
          404,
          "GYM_EQUIPMENT_NOT_FOUND"
        );
      }

      let signedImageUrl = equipment.imageUrl;

      if (signedImageUrl) {
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: signedImageUrl,
        });
        
        signedImageUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 }); // 1 hour
      }

      return {
        ...equipment,
        imageUrl: signedImageUrl,
      };
    } catch (error) {
      console.error("CRMLead GetById Error:", error);
      throw new AppError(
        `Error fetching CRM lead with ID: ${id}`,
        500,
        "GYM_EQUIPMENT_DB_FETCH_BY_ID_ERROR"
      );
    }
  }

  // static async update(id: string, data: any, file?: Express.Multer.File) {
  //   try {
  //     if (!data.gymId || !data.gymBranchId) {
  //       throw new AppError(
  //         "Gym ID and Branch ID are required",
  //         400,
  //         "GYM_EQUIPMENT_GYM_BRANCH_ID_REQUIRED"
  //       );
  //     }

  //     return await prisma.equipment.update({
  //       where: {
  //         id,
  //         gymId: data.gymId,
  //         gymBranchId: data.gymBranchId,
  //       },
  //       data,
  //     });
  //   } catch (error) {
  //     console.error("CRMLead Update Error:", error);
  //     throw new AppError(
  //       `Error updating CRM lead with ID: ${id}`,
  //       500,
  //       "GYM_EQUIPMENT_DB_UPDATE_ERROR"
  //     );
  //   }
  // }

  static async update(
    id: string,
    data: any,
    file?: Express.Multer.File
  ) {
    try {
      const { gymId, gymBranchId } = data;
  
      if (!gymId || !gymBranchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "GYM_EQUIPMENT_GYM_BRANCH_ID_REQUIRED"
        );
      }
  
      // Fetch existing equipment to delete old image if needed
      const existingEquipment = await prisma.equipment.findFirst({
        where: { id, gymId, gymBranchId },
      });
  
      if (!existingEquipment) {
        throw new AppError(
          "Equipment not found",
          404,
          "GYM_EQUIPMENT_NOT_FOUND"
        );
      }
  
      // If new image is provided
      if (file) {
        // Delete old image from S3 if exists
        if (existingEquipment.imageUrl) {
          await deleteImageFromS3(existingEquipment.imageUrl);
        }
  
        // Upload new image to S3
        const { key, name: originalName, mime } = await uploadImageToS3(
          file,
          'equipment-images'
        );
  
        data.imageUrl = key;
        data.imageName = originalName;
        data.mimeType = mime;
      }
  
      return await prisma.equipment.update({
        where: {
          id,
          gymId,
          gymBranchId,
        },
        data,
      });
  
    } catch (error) {
      console.error("GYM_EQUIPMENT_DB_UPDATE_ERROR", error);
      throw new AppError(
        `Error updating equipment with ID: ${id}`,
        500,
        "GYM_EQUIPMENT_DB_UPDATE_ERROR"
      );
    }
  }
  




  // static async delete(id: string, gymId: string, branchId: string) {
  //   try {
  //     if (!gymId || !branchId) {
  //       throw new AppError(
  //         "Gym ID and Branch ID are required",
  //         400,
  //         "GYM_EQUIPMENT_GYM_BRANCH_ID_REQUIRED"
  //       );
  //     }

  //     return await prisma.equipment.delete({
  //       where: {
  //         id,
  //         gymId,
  //         gymBranchId: branchId,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("CRMLead Delete Error:", error);
  //     throw new AppError(
  //       `Error deleting CRM lead with ID: ${id}`,
  //       500,
  //       "GYM_EQUIPMENT_DB_DELETE_ERROR"
  //     );
  //   }
  // }



  static async delete(id: string, gymId: string, branchId: string) {
    try {
      if (!gymId || !branchId) {
        throw new AppError(
          "Gym ID and Branch ID are required",
          400,
          "GYM_EQUIPMENT_GYM_BRANCH_ID_REQUIRED"
        );
      }
  
      // Step 1: Fetch equipment to get image key
      const equipment = await prisma.equipment.findFirst({
        where: { id, gymId, gymBranchId: branchId },
      });
  
      if (!equipment) {
        throw new AppError("Equipment not found", 404, "GYM_EQUIPMENT_NOT_FOUND");
      }
  
      // Step 2: Delete image from S3 if exists
      if (equipment.imageUrl) {
        try {
          await deleteImageFromS3(equipment.imageUrl); // imageUrl stores the S3 key
        } catch (s3Err) {
          console.error(`Failed to delete image from S3 for equipment ${id}`, s3Err);
          // Continue with DB delete even if S3 fails
        }
      }
  
      // Step 3: Delete equipment from DB
      return await prisma.equipment.delete({
        where: {
          id,
          gymId,
          gymBranchId: branchId,
        },
      });
  
    } catch (error) {
      console.error("GYM_EQUIPMENT_DB_DELETE_ERROR", error);
      throw new AppError(
        `Error deleting equipment with ID: ${id}`,
        500,
        "GYM_EQUIPMENT_DB_DELETE_ERROR"
      );
    }
  }
  
}
