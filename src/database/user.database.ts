import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/hashPassword";
import { sendPasswordSetupEmail } from "../utils/emailService";
import crypto from "crypto";
import { deleteImageFromS3, uploadImageToS3 } from '../utils/s3'; // Adjust the import path as needed
import { getPresignedImageUrl } from "../utils/getPresignedImageUrl";


const prisma = new PrismaClient();

export class UserDatabase {
  // static async create(data: any) {
  //   try {
  //     return await prisma.user.create({ data });
  //   } catch (error) {
  //     console.log(error, "error-user")
  //     throw new AppError(
  //       "Error creating user",
  //       500,
  //       "USER_DB_CREATE_ERROR"
  //     );
  //   }
  // }


  // static async create(data: any) {
  //   try {

  //     // For other roles, just create the user
  //     if (!data.gymId || !data.gymBranchId) {
  //       throw new AppError(
  //         "Gym ID and Branch ID are required",
  //         400,
  //         "USER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
  //       );
  //     }

  //       // Generate a secure random password
  //       const plainPassword = crypto.randomBytes(12).toString("hex"); // 24 character random string
  //       // Hash the password for storage
  //       const hashedPassword = await hashPassword(plainPassword);
  //       await sendPasswordSetupEmail(data.email, plainPassword);

  //     return await prisma.user.create({ ...data, password: hashedPassword });
  //   } catch (error) {
  //     console.log(error, "error-user");
  //     throw new AppError("Error creating user", 500, "USER_DB_CREATE_ERROR");
  //   }
  // }


  // static async create(data: any) {
  //   try {

  //     if (!data.gymId || !data.gymBranchId) {
  //       throw new AppError(
  //         "Gym ID and Branch ID are required",
  //         400,
  //         "USER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
  //       );
  //     }

  
  //     // Generate secure random password
  //     const plainPassword = crypto.randomBytes(12).toString("hex");
  //     console.log("plainPassword", plainPassword);
  //     const hashedPassword = await hashPassword(plainPassword);
  
  //     // Send password setup email
  //     console.log("Sending password setup email to:", data.email);
  //     await sendPasswordSetupEmail(data.email, plainPassword);
  
  //     // Create user
  //     return await prisma.user.create({
  //       data: {
  //         ...data,
  //         password: hashedPassword,
  //       },
  //     });

  //   } catch (error) {
  //     console.log(error, "error-user");
  //     throw new AppError("Error creating user", 500, "USER_DB_CREATE_ERROR");
  //   }
  // }





    static async create(data: any, file?: Express.Multer.File) {
      try {
        if (!data.gymId || !data.gymBranchId) {
          throw new AppError(
            "Gym ID and Branch ID are required",
            400,
            "USER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
          );
        }
  
        // Upload image if present
        let imageData = {};
        if (file) {
          // const { key, name: originalName, mime } = await uploadImageToS3(file);
          const { key, name: originalName, mime } = await uploadImageToS3(file, 'user-profile-images');
          imageData = {
            imageUrl: key,
            imageName: originalName,
            mimeType: mime,
          };
        }
  
        // Generate secure random password
        const plainPassword = crypto.randomBytes(12).toString("hex");
        const hashedPassword = await hashPassword(plainPassword);
  
        // Send password setup email
        await sendPasswordSetupEmail(data.email, plainPassword);
  
        // Create user in DB
        return await prisma.user.create({
          data: {
            ...data,
            password: hashedPassword,
            ...imageData,
          },
        });
  
      } catch (error) {
        console.log(error, "error-user");
        throw new AppError("Error creating user", 500, "USER_DB_CREATE_ERROR");
      }
    }
  
  

  // static async getAll(gymId: string, branchId: string) {
  //   try {
  //     if (!gymId || !branchId) {
  //       throw new AppError(
  //         "Gym ID and Branch ID are required",
  //         400,
  //         "USER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
  //       );
  //     }
  //     return await prisma.user.findMany({
  //       where: {
  //         gymId,
  //         gymBranchId: branchId,
  //       },
  //     });
  //   } catch (error) {
  //     throw new AppError(
  //       "Error fetching users",
  //       500,
  //       "USER_DB_FETCH_ALL_ERROR"
  //     );
  //   }
  // }



static async getAll(gymId: string, branchId: string) {
  try {
    if (!gymId || !branchId) {
      throw new AppError(
        "Gym ID and Branch ID are required",
        400,
        "USER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
      );
    }

    const users = await prisma.user.findMany({
      where: {
        gymId,
        gymBranchId: branchId,
      },
    });

    const processedUsers = await Promise.all(
      users.map(async (user) => {
        let imageUrl = await getPresignedImageUrl(user?.imageUrl);

        return {
          ...user,
          imageUrl,
        };
      })
    );

    return processedUsers;
  } catch (error) {
    console.log(error, 'USER_DB_FETCH_ALL_ERROR');
    throw new AppError("Error fetching users", 500, "USER_DB_FETCH_ALL_ERROR");
  }
}









  // static async loginCurrentUser(data:any) {
  //   const { email, password } = data;

  //   const user =  await prisma.user.findUnique({
  //     where: { email }
  //   });

  //   if (!user) {
  //     throw new AppError(
  //       "user not found",
  //       404,
  //       "USER_DB_NOT_FOUND_ERROR"
  //     );
  //   }

  //   const isValid = await bcrypt.compare(password, user.password);

  //   if (!isValid) {
  //     throw new AppError(
  //       "invalid credentials",
  //       403,
  //       "USER_DB_CREDENTIALS_FOUND_WRONG"
  //     );
  //   }

  //   const payload = {
  //     userId: user.id,
  //     role: user.role,
  //     gymId: user.gymId,
  //     gymBranchId: user.gymBranchId ?? null,
  //   };

  //   const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
  //     expiresIn: '7d',
  //   });

  //   return ({
  //     token,
  //     user: payload,
  //   });
  // }

  static async loginCurrentUser(data: any) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        gym: true, // optional (if you want to use gym details later)
        gymBranch: true, // optional (if you want branch details later)
      },
    });

    if (!user) {
      throw new AppError("User not found", 404, "USER_DB_NOT_FOUND_ERROR");
    }

    if (!user.password) {
      throw new AppError(
        "User password not set",
        500,
        "USER_DB_PASSWORD_NULL_ERROR"
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new AppError(
        "Invalid credentials",
        403,
        "USER_DB_CREDENTIALS_INVALID_ERROR"
      );
    }

    const payload = {
      userId: user.id,
      role: user.role,
      gymId: user.gymId,
      gymBranchId: user.gymBranchId ?? null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    return {
      token,
      user: payload,
    };
  }



  // static async getById(id: string, gymId: string, branchId: string) {
  //   try {
  //     if (!gymId || !branchId) {
  //       throw new AppError(
  //         "Gym ID and Branch ID are required",
  //         400,
  //         "USER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
  //       );
  //     }

  //     return await prisma.user.findUnique({
  //       where: {
  //         id,
  //         gymId,
  //         gymBranchId: branchId,
  //       },
  //     });
  //   } catch (error) {
  //     throw new AppError(
  //       `Error fetching user with ID: ${id}`,
  //       500,
  //       "USER_DB_FETCH_BY_ID_ERROR"
  //     );
  //   }
  // }




static async getById(id: string, gymId: string, branchId: string) {
  try {
    if (!gymId || !branchId) {
      throw new AppError(
        "Gym ID and Branch ID are required",
        400,
        "USER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        id,
        gymId,
        gymBranchId: branchId,
      },
    });

    if (!user) {
      throw new AppError(
        `User with ID ${id} not found`,
        404,
        "USER_NOT_FOUND"
      );
    }

    let signedImageUrl = await getPresignedImageUrl(user?.imageUrl);

    return {
      ...user,
      imageUrl: signedImageUrl,
    };
  } catch (error) {
    console.log(error, 'USER_DB_FETCH_BY_ID_ERROR');
    throw new AppError(
      `Error fetching user with ID: ${id}`,
      500,
      "USER_DB_FETCH_BY_ID_ERROR"
    );
  }
}



  static async changePasswordCurrentUser(data: any, userId: string) {


    const { currentPassword, newPassword } = data;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user || !user.password) {
        throw new AppError("User not found or password not set", 404, "USER_DB_NOT_FOUND_ERROR");
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new AppError("Incorrect current password", 403, "USER_DB_CREDENTIALS_INVALID_ERROR");
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });
  
      return { message: "Password changed successfully" };
  
    } catch (error) {
      throw new AppError(
        `Error changing password for userId: ${userId}`,
        500,
        "USER_PASSWORD_CHANGE_ERROR"
      );
    }





    
  }

  static async getByEmail(email: string, gymId: string, branchId: string) {
    try {
      return await prisma.user.findUnique({
        where: { email, gymId, gymBranchId: branchId },
      });
    } catch (error) {
      throw new AppError(
        `Error fetching user with email: ${email}`,
        500,
        "USER_DB_FETCH_BY_EMAIL_ERROR"
      );
    }
  }

  // static async update(id: string, data: any) {
  //   try {
  //     if (!data.gymId || !data.gymBranchId) {
  //       throw new AppError(
  //         "Gym ID and Branch ID are required",
  //         400,
  //         "USER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
  //       );
  //     }

  //     return await prisma.user.update({
  //       where: { id, gymId: data.gymId, gymBranchId: data.gymBranchId },
  //       data,
  //     });
  //   } catch (error) {
  //     console.log(error, "error")
  //     throw new AppError(
  //       `Error updating user with ID: ${id}`,
  //       500,
  //       "USER_DB_UPDATE_ERROR"
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
          "USER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
        );
      }
  
      // Fetch existing user to delete old image if needed
      const existingUser = await prisma.user.findFirst({
        where: { id, gymId, gymBranchId },
      });
  
      if (!existingUser) {
        throw new AppError("User not found", 404, "USER_NOT_FOUND");
      }
  
      // If new image is provided, delete old and upload new
      if (file) {
        if (existingUser.imageUrl) {
          await deleteImageFromS3(existingUser.imageUrl); // key = imageUrl
        }
  
        const { key, name: originalName, mime } = await uploadImageToS3(
          file,
          'user-profile-images'
        );
  
        data.imageUrl = key;
        data.imageName = originalName;
        data.mimeType = mime;
      }
  
      return await prisma.user.update({
        where: { id, gymId, gymBranchId },
        data,
      });
  
    } catch (error) {
      console.error("USER_DB_UPDATE_ERROR", error);
      throw new AppError(
        `Error updating user with ID: ${id}`,
        500,
        "USER_DB_UPDATE_ERROR"
      );
    }
  }

  // static async delete(id: string, gymId: string, branchId: string) {
  //   try {
  //     if (!gymId || !branchId) {
  //       throw new AppError(
  //         "Gym ID and Branch ID are required",
  //         400,
  //         "USER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
  //       );
  //     }
  //     return await prisma.user.delete({
  //       where: { id, gymId, gymBranchId: branchId },
  //     });
  //   } catch (error) {
  //     throw new AppError(
  //       `Error deleting user with ID: ${id}`,
  //       500,
  //       "USER_DB_DELETE_ERROR"
  //     );
  //   }
  // }


static async delete(id: string, gymId: string, branchId: string) {
  try {
    if (!gymId || !branchId) {
      throw new AppError(
        "Gym ID and Branch ID are required",
        400,
        "USER_GYM_BRANCH_AND_GYM_ID_REQUIRED"
      );
    }

    // Step 1: Fetch user to get image key
    const user = await prisma.user.findFirst({
      where: { id, gymId, gymBranchId: branchId },
    });

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    // Step 2: Delete image from S3 if exists
    if (user.imageUrl) {
      try {
        await deleteImageFromS3(user.imageUrl); // `imageUrl` stores the S3 key
      } catch (s3Err) {
        console.error(`Failed to delete image from S3 for user ${id}`, s3Err);
        // Don't block DB delete just because S3 failed
      }
    }

    // Step 3: Delete user from DB
    return await prisma.user.delete({
      where: { id, gymId, gymBranchId: branchId },
    });

  } catch (error) {
    console.error(error, "USER_DB_DELETE_ERROR");
    throw new AppError(
      `Error deleting user with ID: ${id}`,
      500,
      "USER_DB_DELETE_ERROR"
    );
  }
}

}
