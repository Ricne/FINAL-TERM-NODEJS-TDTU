import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Price from '../../components/Price/Price';
import StarRating from '../../components/StarRating/StarRating';
import Tags from '../../components/Tags/Tags';
import { useCart } from '../../hooks/useCart';
import { getById, rateProduct, getComments, addComment  } from '../../services/productService';
import classes from './productPage.module.css';
import NotFound from '../../components/NotFound/NotFound';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { update } from '../../services/productService';
import { Heart, HeartOff } from 'lucide-react';

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [comment, setComment] = useState(''); 
  const [comments, setComments] = useState([]); 

  const handleAddToCart = () => {
    addToCart(product);
    navigate('/cart');
  };

  const handleRatingChange = async (newRating) => {
    setUserRating(newRating);
    try {
      await rateProduct(id, newRating);
      setProduct((prevProduct) => ({
        ...prevProduct,
        stars: newRating,
      }));
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const nextImage = () => {
    if (!product?.imagesUrl) return;
    setImageIndex((prev) => (prev + 1) % product.imagesUrl.length);
  };

  const prevImage = () => {
    if (!product?.imagesUrl) return;
    setImageIndex((prev) => (prev - 1 + product.imagesUrl.length) % product.imagesUrl.length);
  };


useEffect(() => {
  const fetchProduct = async () => {
    const fetchProduct = await getById(id);
    if (fetchProduct.imageUrls && !fetchProduct.imagesUrl) {
      fetchProduct.imagesUrl = fetchProduct.imageUrls;
    }
    setProduct(fetchProduct);
    setUserRating(fetchProduct.stars);

    const loadedComments = await getComments(id);
    setComments(loadedComments);
  };

  fetchProduct();
}, [id]);

const handleCommentChange = (e) => {
  setComment(e.target.value);
};

const handleAddComment = async () => {
  if (!comment.trim()) {
    return toast.error('Please enter a valid comment');
  }

  try {
    const updatedComments = await addComment(id, user.id, comment); 
    setComments(updatedComments);  
    setComment('');
  } catch (err) {
    console.error('Failed to add comment', err);
    toast.error('Failed to add comment');
  }
};

const toggleFavorite = async (id) => {
  const updatedFavorite = !product.favorite;

  setProduct({ ...product, favorite: updatedFavorite });

  try {
    // Gọi API cập nhật DB (nếu cần)
    await update(product); // hoặc: await updateFavorite(id, updatedFavorite);
  } catch (error) {
    console.error('Failed to update favorite status', error);
    // Quay lại trạng thái cũ nếu thất bại
    setProduct({ ...product, favorite: !updatedFavorite });
  }
};

  if (!product) {
    return <NotFound message="Product Not Found!" linkText="Back To Homepage" />;
  }

  return (
    <div className={classes.container}>
      <div className={classes.imageContainer}>
        {/* Kiểm tra ảnh tồn tại trong product.imagesUrl */}
        {product.imagesUrl && product.imagesUrl.length > 0 ? (
          <img
            className={classes.images}
            src={product.imagesUrl[imageIndex]}  // Chọn ảnh theo index
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;  // Đảm bảo không bị lặp vô tận khi ảnh bị lỗi
              e.target.src = '/path/to/default-image.jpg';  // Ảnh mặc định khi không có ảnh
            }}
          />
        ) : (
          <div className={classes.noImage}>No Image Available</div>
        )}

        {/* Hiển thị nút điều khiển khi có nhiều ảnh */}
        {product.imagesUrl?.length > 1 && (
          <div className={classes.carouselControls}>
            <button className={classes['prev-btn']} onClick={prevImage}>
              <svg version="1.1" id="Capa_1" x="0px" y="0px" fill="white" viewBox="0 0 306 306" style={{ enableBackground: 'new 0 0 306 306' }}>
                <g>
                  <g id="chevron-left">
                    <polygon points="247.35,35.7 211.65,0 58.65,153 211.65,306 247.35,270.3 130.05,153 " />
                  </g>
                </g>
              </svg>
            </button>
            <span>{imageIndex + 1} / {product.imagesUrl.length}</span>
            <button className={classes['next-btn']} onClick={nextImage}>
              <svg version="1.1" id="Capa_1" x="0px" y="0px" fill="white" viewBox="0 0 306 306" style={{ enableBackground: 'new 0 0 306 306' }}>
                <g>
                  <g id="chevron-right">
                    <polygon points="94.35,0 58.65,35.7 175.95,153 58.65,270.3 94.35,306 247.35,153 " />
                  </g>
                </g>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className={classes.details}>
        <div className={classes.header}>
          <span className={classes.name}>{product.name}</span>
          <span className={`${classes.favorite}`} onClick={() => toggleFavorite(product.id)} aria-label="Toggle favorite" role="button" tabIndex={0} >
            {product.favorite ? <Heart color="#e72929" fill="#e72929" /> : <Heart />}
          </span>

        </div>

        <div className={classes.origins}>
          {product.origins?.map((origin) => (
            <span key={origin}>{origin}</span>
          ))}
        </div>

        <div className={classes.tags}>
          {product.tags && (
            <Tags tags={product.tags.map((tag) => ({ name: tag }))} 
            forProductPage={true} />
          )}
        </div>

        <div className={classes.description}>
          <span>
            Description: <strong>{product.description}</strong>
          </span>
        </div>

        <div className={classes.price}>
          <Price price={product.price} />
        </div>

        <button className={classes.cartButton} onClick={handleAddToCart}>
          Add To Cart
        </button>
        <div><br></br></div>

        <div className={classes.rating}>
          <StarRating
            stars={userRating !== null ? userRating : product.stars}
            size={25}
            editable={true}
            onRatingChange={handleRatingChange}
            isLoggedIn={!!user}
            comment={comment}
            comments={comments}
            onCommentChange={handleCommentChange}
            onAddComment={handleAddComment}
          />
        </div>
      </div>
    </div>
  );
}