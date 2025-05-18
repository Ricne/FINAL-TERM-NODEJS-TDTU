import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const uploadImage = async (files) => {
  let toastId = null;

  const validImages = files.filter(file => file.type === 'image/jpeg');
  if (!validImages.length) {
    toast.error('Only JPG files are allowed.');
    return [];
  }

  const formData = new FormData();
  validImages.forEach(image => {
    formData.append('images', image, image.name);
  });

  try {
    const response = await axios.post(`${API_URL}/api/upload`, formData, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        if (toastId === null) {
          toastId = toast.info('Uploading images...', { autoClose: false, closeOnClick: false, draggable: false });
        }
        toast.update(toastId, { 
          render: `Uploading... ${progress}%`,
          progress: progress / 100,
          type: toast.TYPE.INFO,
          autoClose: false,
          closeOnClick: false,
          draggable: false,
        });
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.dismiss(toastId);
    toast.success('Upload successful!');
    return response.data.imageUrls;
  } catch (error) {
    toast.dismiss(toastId);
    toast.error('Upload failed! Please try again.');
    console.error('Upload failed:', error);
    return [];
  }
};