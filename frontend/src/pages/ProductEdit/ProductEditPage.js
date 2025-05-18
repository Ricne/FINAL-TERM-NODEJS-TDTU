import { useParams, useNavigate } from 'react-router-dom';
import classes from './productEdit.module.css';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { add, getById, update } from '../../services/productService';
import Title from '../../components/Title/Title';
import InputContainer from '../../components/InputContainer/InputContainer';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { uploadImage } from '../../services/uploadService';
import { toast } from 'react-toastify';

export default function ProductEditPage() {
  const { productId } = useParams();
  const isEditMode = !!productId;
  const navigate = useNavigate();

  const [imagesUrl, setImagesUrl] = useState([]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!isEditMode) return;

    getById(productId).then(product => {
      if (!product) return;
      reset(product);
      setImagesUrl(product.imagesUrl || []);
    });
  }, [productId, reset]);

  const submit = async (productData) => {
    const product = {
      ...productData,
      imagesUrl,
      tags: Array.isArray(productData.tags) ? productData.tags : (productData.tags?.split(',').map(t => t.trim()) || []),
      origins: Array.isArray(productData.origins) ? productData.origins : (productData.origins?.split(',').map(o => o.trim()) || [])
    };

    if (isEditMode) {
      await update(product);
      toast.success(`Product "${product.name}" updated successfully!`);
    } else {
      const newProduct = await add(product);
      toast.success(`Product "${product.name}" added successfully!`);
      navigate('/admin/editProduct/' + newProduct.id, { replace: true });
    }
  };


  const upload = async (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) {
    toast.warning('No files selected!', 'File Upload');
    return;
  }

  const imageUrls = await uploadImage(files);
  console.log('Uploaded URLs:', imageUrls);
  setImagesUrl(prev => [...prev, ...imageUrls]); 
};


  const removeImage = (url) => {
    setImagesUrl(prev => prev.filter(img => img !== url));
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title={isEditMode ? 'Edit Product' : 'Add Product'} />
        <form className={classes.form} onSubmit={handleSubmit(submit)} noValidate>

          <InputContainer label="Select Images">
            <input type="file" onChange={upload} accept="image/jpeg" multiple />
          </InputContainer>

          {imagesUrl.length > 0 && (
            <div className={classes.imagePreviewGrid}>
              {imagesUrl.map((url, idx) => (
                <div key={idx} className={classes.imageItem}>
                  <img
                    src={url}
                    alt={`img-${idx}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=Image+not+found';
                    }}
                  />
                  <button
                    type="button"
                    className={classes.removeButton}
                    onClick={() => removeImage(url)}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}

          <Input
            type="text"
            label="Name"
            {...register('name', { required: true, minLength: 5 })}
            error={errors.name}
          />

          <Input
            type="number"
            label="Price"
            {...register('price', { required: true })}
            error={errors.price}
          />

          <Input
            type="text"
            label="Tags"
            {...register('tags')}
            error={errors.tags}
          />

          <Input
            type="text"
            label="Origins"
            {...register('origins', { required: true })}
            error={errors.origins}
          />

          <Input
            type="text"
            label="Description"
            {...register('description', { required: true })}
            error={errors.description}
          />

          <Button type="submit" text={isEditMode ? 'Update' : 'Create'} />
        </form>
      </div>
    </div>
  );
}