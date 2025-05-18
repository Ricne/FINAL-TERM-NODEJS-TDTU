import { Router } from 'express';
import admin from '../middleware/admin.mid.js';
import multer from 'multer';
import handler from 'express-async-handler';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/httpStatus.js';
import { configCloudinary } from '../config/cloudinary.config.js';

const router = Router();
const upload = multer();

router.post(
  '/',
  admin,
  upload.array('images'),
  handler(async (req, res) => {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(BAD_REQUEST).send({ message: 'No files uploaded' });
    }

    const imageUrls = [];

    for (let file of files) {
      try {
        const imageUrl = await uploadImageToCloudinary(file.buffer);
        imageUrls.push(imageUrl);
      } catch (error) {
        console.error('Upload failed for one image:', error);
        return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Upload failed for one image', error: error.message });
      }
    }

    console.log('Image URLs:', imageUrls);
    // Sau khi đã upload xong toàn bộ ảnh, mới trả kết quả:
    res.send({ imageUrls });
  })
);

const uploadImageToCloudinary = imageBuffer => {
  const cloudinary = configCloudinary();

  return new Promise((resolve, reject) => {
    if (!imageBuffer) {
      console.log('No image buffer');
      return reject('No image buffer');
    }

    console.log('Image buffer:', imageBuffer);

    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error || !result) {
        console.log('Error:', error);
        return reject(error || 'No result');
      } else {
        console.log('Upload result:', result);
        resolve(result.secure_url); 
      }
    });

    stream.end(imageBuffer);
  });
};

export default router;