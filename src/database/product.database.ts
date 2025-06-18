import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { deleteImageFromS3, uploadImageToS3 } from '../utils/s3';

const prisma = new PrismaClient();

// export class ProductDatabase {
//   static async create(data: any, files?: Express.Multer.File[]) {

//     try {
//       // Create product with images
//       return await prisma.product.create({
//         data: {
//           name: data.name,
//           description: data.description,
//           price: parseFloat(data.price),
//           discountedPrice: data.discountedPrice ? parseFloat(data.discountedPrice) : null,
//           stockQuantity: parseInt(data.stockQuantity),
//           sku: data.sku,
//           brand: data.brand,
//           weight: data.weight ? parseFloat(data.weight) : null,
//           isActive: data.isActive === 'true',
//           categoryId: data.categoryId,
//           gymId: data.gymId,
//           gymBranchId: data.gymBranchId,
//           images: {
//             create: files?.map(file => ({
//               imageUrl: file.path,
//               imageName: file.filename,
//               mimeType: file.mimetype,
//               isPrimary: false
//             })) || []
//           }
//         },
//         include: {
//           category: true,
//           images: true
//         }
//       });
//     } catch (error) {
//       throw new AppError('Error creating product', 500, 'PRODUCT_CREATE_ERROR');
//     }
//   }


export class ProductDatabase {
    static async create(data: any, files?: Express.Multer.File[]) {
      try {
        const { 
          name, 
          description, 
          price, 
          discountedPrice, 
          stockQuantity, 
          sku, 
          brand, 
          weight, 
          isActive, 
          categoryId, 
          gymId, 
          gymBranchId 
        } = data;
  
        if (!gymId || !gymBranchId) {
          throw new AppError(
            "Gym ID and Branch ID are required",
            400,
            "PRODUCT_GYM_BRANCH_ID_REQUIRED"
          );
        }
  
        // Upload all images to S3
        let imagesData: any[] = [];
        if (files && files.length > 0) {
          imagesData = await Promise.all(
            files.map(async (file, index) => {
              const { key, name, mime } = await uploadImageToS3(file, "muscletech-product-images");
              return {
                imageUrl: key,
                imageName: name,
                mimeType: mime,
                isPrimary: index === 0 // First image is primary
              };
            })
          );
        }
  
        // Use transaction to create product and its images
        const product = await prisma.$transaction(async (tx) => {
          // First create the product
          const newProduct = await tx.product.create({
            data: {
              name,
              description,
              price: parseFloat(price),
              discountedPrice: discountedPrice ? parseFloat(discountedPrice) : null,
              stockQuantity: parseInt(stockQuantity),
              sku,
              brand,
              weight: weight ? parseFloat(weight) : null,
              isActive: isActive === 'true',
              categoryId,
              gymId,
              gymBranchId
            }
          });
  
          // Then create all images with the productId
          if (imagesData.length > 0) {
            await tx.productImage.createMany({
              data: imagesData.map(img => ({
                ...img,
                productId: newProduct.id
              }))
            });
          }
  
          // Return the product with its images
          return await tx.product.findUnique({
            where: { id: newProduct.id },
            include: { 
              category: true,
              images: true 
            }
          });
        });
  
        return product;
  
      } catch (error) {
        console.error(error, "PRODUCT_DB_CREATE_ERROR");
        throw new AppError(
          "Error creating product",
          500,
          "PRODUCT_DB_CREATE_ERROR"
        );
      }
    }
  
  static async getAll(gymId: string, gymBranchId: string, filters?: any) {
    try {
      const where: any = {
        gymId,
        gymBranchId,
        isActive: true
      };

      // Add category filter if provided
      if (filters?.categoryId) {
        where.categoryId = filters.categoryId;
      }

      // Add search filter if provided
      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { brand: { contains: filters.search, mode: 'insensitive' } }
        ];
      }

      return await prisma.product.findMany({
        where,
        include: {
          category: true,
          images: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      throw new AppError('Error fetching products', 500, 'PRODUCT_FETCH_ALL_ERROR');
    }
  }

  static async getById(id: string, gymId: string, gymBranchId: string) {
    try {
      return await prisma.product.findFirst({
        where: {
          id,
          gymId,
          gymBranchId
        },
        include: {
          category: true,
          images: true
        }
      });
    } catch (error) {
      throw new AppError('Error fetching product', 500, 'PRODUCT_FETCH_ERROR');
    }
  }

//   static async update(id: string, data: any, files?: Express.Multer.File[], gymId: string, gymBranchId: string) {
//     try {
//       // First get the existing product
//       const existingProduct = await this.getById(id, gymId, gymBranchId);
//       if (!existingProduct) {
//         throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
//       }

//       // Update product
//       const updatedProduct = await prisma.product.update({
//         where: {
//           id,
//           gymId,
//           gymBranchId
//         },
//         data: {
//           name: data.name,
//           description: data.description,
//           price: data.price ? parseFloat(data.price) : undefined,
//           discountedPrice: data.discountedPrice ? parseFloat(data.discountedPrice) : null,
//           stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : undefined,
//           sku: data.sku,
//           brand: data.brand,
//           weight: data.weight ? parseFloat(data.weight) : null,
//           isActive: data.isActive === 'true',
//           categoryId: data.categoryId,
//           // Add new images if provided
//           images: files?.length ? {
//             create: files.map(file => ({
//               imageUrl: file.path,
//               imageName: file.filename,
//               mimeType: file.mimetype,
//               isPrimary: false
//             }))
//           } : undefined
//         },
//         include: {
//           category: true,
//           images: true
//         }
//       });

//       return updatedProduct;
//     } catch (error) {
//       if (error instanceof AppError) throw error;
//       throw new AppError('Error updating product', 500, 'PRODUCT_UPDATE_ERROR');
//     }
//   }


static async update(id: string, data: any,  gymId: string, gymBranchId: string, files?: Express.Multer.File[]) {
    try {
      // First get the existing product with its images
      const existingProduct = await this.getById(id, gymId, gymBranchId);
      if (!existingProduct) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }
  
      // Upload new images to S3 if provided
      let imagesData: any[] = [];
      if (files && files.length > 0) {
        imagesData = await Promise.all(
          files.map(async (file) => {
            const { key, name, mime } = await uploadImageToS3(file, "muscletech-product-images");
            return {
              imageUrl: key,
              imageName: name,
              mimeType: mime,
              isPrimary: false
            };
          })
        );
      }
  
      // Use transaction to update product and handle images
      const updatedProduct = await prisma.$transaction(async (tx) => {
        // 1. Delete existing images from S3
        for (const img of existingProduct.images) {
          await deleteImageFromS3(img.imageUrl); // imageUrl = key
        }
  
        // 2. Delete existing images from database
        await tx.productImage.deleteMany({
          where: {
            productId: id
          }
        });
  
        // 3. Update the product
        const product = await tx.product.update({
          where: {
            id,
            gymId,
            gymBranchId
          },
          data: {
            name: data.name,
            description: data.description,
            price: data.price ? parseFloat(data.price) : undefined,
            discountedPrice: data.discountedPrice ? parseFloat(data.discountedPrice) : null,
            stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : undefined,
            sku: data.sku,
            brand: data.brand,
            weight: data.weight ? parseFloat(data.weight) : null,
            isActive: data.isActive === 'true',
            categoryId: data.categoryId
          }
        });
  
        // 4. Add new images if provided
        if (imagesData.length > 0) {
          await tx.productImage.createMany({
            data: imagesData.map(img => ({
              ...img,
              productId: product.id
            }))
          });
        }
  
        // Return the updated product with its images
        return await tx.product.findUnique({
          where: { id: product.id },
          include: { 
            category: true,
            images: true 
          }
        });
      });
  
      return updatedProduct;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating product', 500, 'PRODUCT_UPDATE_ERROR');
    }
  }

  static async delete(id: string, gymId: string, gymBranchId: string) {
    try {
      // First check if product exists
      const product = await this.getById(id, gymId, gymBranchId);
      if (!product) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }

      // Check if product is in any active orders
      const activeOrders = await prisma.orderItem.findFirst({
        where: {
          productId: id,
          order: {
            status: {
              in: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED']
            }
          }
        }
      });

      if (activeOrders) {
        throw new AppError('Cannot delete product with active orders', 400, 'PRODUCT_HAS_ACTIVE_ORDERS');
      }

      // Delete product and its images
      await prisma.product.delete({
        where: {
          id,
          gymId,
          gymBranchId
        }
      });

      return true;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error deleting product', 500, 'PRODUCT_DELETE_ERROR');
    }
  }

  static async updateStock(id: string, quantity: number, gymId: string, gymBranchId: string) {
    try {
      const product = await this.getById(id, gymId, gymBranchId);
      if (!product) {
        throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
      }

      return await prisma.product.update({
        where: {
          id,
          gymId,
          gymBranchId
        },
        data: {
          stockQuantity: product.stockQuantity + quantity
        }
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error updating product stock', 500, 'PRODUCT_STOCK_UPDATE_ERROR');
    }
  }
}