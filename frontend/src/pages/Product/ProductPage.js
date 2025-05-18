// FULL ProductPage.jsx với sửa lỗi lọc sản phẩm liên quan chính xác trong khoảng ±2 triệu

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Price from '../../components/Price/Price';
import StarRating from '../../components/StarRating/StarRating';
import Tags from '../../components/Tags/Tags';
import NotFound from '../../components/NotFound/NotFound';

import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { getById, rateProduct, getComments, addComment, update, getAll } from '../../services/productService';

import { Heart } from 'lucide-react';
import classes from './productPage.module.css';

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
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const prod = await getById(id);
      if (prod.imageUrls && !prod.imagesUrl) {
        prod.imagesUrl = prod.imageUrls;
      }
      setProduct(prod);
      setUserRating(prod.stars);
      const commentList = await getComments(id);
      setComments(commentList);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product) return;
      const { data: allProducts } = await getAll();

      const related = allProducts.filter(p => {
        if (p.id === product.id || typeof p.price !== 'number') return false;
        const priceDiff = Math.abs(p.price - product.price);
        const sameTag = p.tags?.some(tag => product.tags?.includes(tag));
        return priceDiff <= 2_000_000 || sameTag;
      });

      setRelatedProducts(related);
    };
    fetchRelated();
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product);
    navigate('/cart');
  };

  const handleRatingChange = async (newRating) => {
    setUserRating(newRating);
    try {
      await rateProduct(id, newRating);
      setProduct(prev => ({ ...prev, stars: newRating }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleAddComment = async () => {
    if (!comment.trim()) return toast.error('Please enter a valid comment');
    try {
      const updated = await addComment(id, user.id, comment);
      setComments(updated);
      setComment('');
      setIsExpanded(false);
    } catch {
      toast.error('Failed to add comment');
    }
  };

  const toggleFavorite = async () => {
    const newFav = !product.favorite;
    setProduct({ ...product, favorite: newFav });
    try {
      await update(product);
    } catch {
      setProduct({ ...product, favorite: !newFav });
    }
  };

  if (!product) return <NotFound message="Product Not Found!" linkText="Back To Homepage" />;

  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const currentComments = isExpanded
    ? comments.slice((currentPage - 1) * commentsPerPage, currentPage * commentsPerPage)
    : comments.slice(0, 3);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.imageContainer}>
          {product.imagesUrl?.length > 0 ? (
            <img
              className={classes.images}
              src={product.imagesUrl[imageIndex]}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/path/to/default.jpg';
              }}
            />
          ) : (
            <div className={classes.noImage}>No Image</div>
          )}

          {product.imagesUrl?.length > 1 && (
            <div className={classes.carouselControls}>
              <button className={classes['prev-btn']} onClick={() =>
                setImageIndex(i => (i - 1 + product.imagesUrl.length) % product.imagesUrl.length)}>
                &lt;
              </button>
              <span>{imageIndex + 1} / {product.imagesUrl.length}</span>
              <button className={classes['next-btn']} onClick={() =>
                setImageIndex(i => (i + 1) % product.imagesUrl.length)}>
                &gt;
              </button>
            </div>
          )}
        </div>

        <div className={classes.details}>
          <div className={classes.header}>
            <span className={classes.name}>{product.name}</span>
            <span className={classes.favorite} onClick={toggleFavorite}>
              {product.favorite ? <Heart color="#e72929" fill="#e72929" /> : <Heart />}
            </span>
          </div>

          <div className={classes.origins}>
            {product.origins?.map((origin, i) => <span key={i}>{origin}</span>)}
          </div>

          <div className={classes.tags}>
            {product.tags && <Tags tags={product.tags.map(tag => ({ name: tag }))} forProductPage />}
          </div>

          <div className={classes.description}>
            <span>Description: <strong>{product.description}</strong></span>
          </div>

          <div className={classes.price}><Price price={product.price} /></div>

          <button className={classes.cartButton} onClick={handleAddToCart}>Add To Cart</button>

          <div className={classes.rating}>
            <StarRating
              stars={userRating ?? product.stars}
              size={25}
              editable={true}
              onRatingChange={handleRatingChange}
              isLoggedIn={!!user}
            />
          </div>
        </div>
      </div>

      {/* ==== COMMENTS ==== */}
      <div className={classes.commentWrapper}>
        <div className={classes.commentSection}>
          <textarea
            className={classes.commentInput}
            placeholder="Add a comment..."
            value={comment}
            onChange={handleCommentChange}
          />
          <button className={classes.commentButton} onClick={handleAddComment}>
            Add Comment
          </button>

          <div className={classes.commentList}>
            <h3>Comments</h3>
            {currentComments.map((c, i) => (
              <div key={i} className={classes.commentBox}>
                <strong>{c.userId?.name || 'User'}:</strong>
                <p>{c.content}</p>
                <span>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
            ))}

            {!isExpanded && comments.length > 3 && (
              <button className={classes.showMoreButton} onClick={() => setIsExpanded(true)}>Show more</button>
            )}

            {isExpanded && totalPages > 1 && comments.length > commentsPerPage && (
              <div className={classes.pagination}>
                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>&laquo; Prev</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={currentPage === i + 1 ? classes.activePage : ''}
                    onClick={() => setCurrentPage(i + 1)}
                  >{i + 1}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next &raquo;</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==== RELATED PRODUCTS ==== */}
      <div className={classes.relatedSection}>
        <h3>Related products</h3>

        {relatedProducts.length === 0 ? (
          <p className={classes.noRelated}>No related products found.</p>
        ) : (
          <div className={classes.relatedList}>
            {relatedProducts.map(item => (
              <div key={item.id} className={classes.relatedItem} onClick={() => navigate(`/product/${item.id}`)}>
                <img src={item.imageUrls?.[0]} alt={item.name} />
                <div className={classes.relatedName}>{item.name}</div>
                <Price price={item.price} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}