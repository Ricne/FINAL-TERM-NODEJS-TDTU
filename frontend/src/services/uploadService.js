import { toast } from 'react-toastify';
import axios from 'axios';

export const uploadImage = async (files) => {
  let toastId = null;

  const validImages = files.filter(file => file.type === 'image/jpeg');
  if (!validImages.length) {
    toast.error('Only JPG files are allowed.', 'File Type Error');
    return [];
  }

  const formData = new FormData();
  validImages.forEach(image => {
    formData.append('images', image, image.name);
  });

  try {
    const response = await axios.post('api/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        if (toastId) {
          toast.update(toastId, { progress });
        } else {
          toastId = toast.success('Uploading...', { progress });
        }
      },
    });

    toast.dismiss(toastId);
    return response.data.imageUrls;
  } catch (error) {
    toast.dismiss(toastId);
    toast.error('Upload failed! Please try again.', 'Upload Error');
    console.error('Upload failed:', error);
    return [];
  }
};