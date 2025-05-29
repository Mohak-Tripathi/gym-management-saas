import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});




export const uploadImageToS3 = async (
    file: Express.Multer.File,
    folder: string = 'misc' // default fallback
  ): Promise<{ key: string; name: string; mime: string }> => {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `${folder}/${fileName}`;
  
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  
    await s3.upload(params).promise();
  
    return {
      key,
      name: file.originalname,
      mime: file.mimetype,
    };
  };
  


  export const deleteImageFromS3 = async (key: string): Promise<void> => {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    };
  
    try {
      await s3.deleteObject(params).promise();
    } catch (err) {
      console.error(`Failed to delete image from S3: ${key}`, err);
      throw new Error("Failed to delete image from S3");
    }
  };


export const uploadFileToS3 = async (file: Express.Multer.File, s3folderName: string): Promise<{ key: string; name: string; mime: string }> => {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;

  if(!s3folderName){
    throw new Error("S3 folder name is required");
  }

  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `${s3folderName}/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.upload(params).promise();

  return {
    // url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/domain-icons/${fileName}`,
    key: `${s3folderName}/${fileName}`,
    name: file.originalname,
    mime: file.mimetype,
  };
};



export const uploadFileBufferToS3 = async (
    buffer: Buffer,
    options: {
      originalName: string;
      mimeType: string;
      folder: string;
    }
  ): Promise<{ key: string; name: string; mime: string }> => {
    const fileExtension = options.originalName.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
  
    if (!options.folder) {
      throw new Error("S3 folder name is required");
    }
  
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `${options.folder}/${fileName}`,
      Body: buffer,
      ContentType: options.mimeType,
    };
  
    await s3.upload(params).promise();
  
    return {
      // url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${options.folder}/${fileName}`,
      key: `${options.folder}/${fileName}`,
      name: options.originalName,
      mime: options.mimeType,
    };
  };
  


  // export const uploadImageToS3 = async (
//   file: Express.Multer.File
// ): Promise<{ key: string; name: string; mime: string }> => {
//   const fileExtension = file.originalname.split(".").pop();
//   const fileName = `${uuidv4()}.${fileExtension}`;
//   const key = `domain-icons/${fileName}`;

//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME!,
//     Key: key,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   await s3.upload(params).promise();

//   return {
//     key, // <-- Only store key
//     name: file.originalname,
//     mime: file.mimetype,
//   };
// };