import React, { useState, useEffect } from 'react';
import classes from './starRating.module.css';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

export default function StarRating({
  stars,
  size,
  onRatingChange,
  editable,
  isLoggedIn,
  showComment = true,
  comment,
  comments,
  onCommentChange,
  onAddComment,
}) {
  const [hoveredStar, setHoveredStar] = useState(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const location = useLocation();

  const styles = {
    width: size + 'px',
    height: size + 'px',
    cursor: editable ? 'pointer' : 'default',
  };

  function Star({ number }) {
    const halfNumber = number - 0.5;
    const currentStars = hoveredStar !== null ? hoveredStar : stars;

    const handleClick = (number) => {
      if (!isLoggedIn) {
        setShowLoginMessage(true);
        return;
      }
      if (editable && onRatingChange) {
        onRatingChange(number);
      }
    };

    return (
      <div className={classes.star}>
        {currentStars >= number ? (
          <img
            src="/star-full.svg"
            style={styles}
            alt={number}
            onClick={() => handleClick(number)}
            onMouseEnter={() => editable && setHoveredStar(number)}
            onMouseLeave={() => editable && setHoveredStar(null)}
          />
        ) : currentStars >= halfNumber ? (
          <img
            src="/star-half.svg"
            style={styles}
            alt={number}
            onClick={() => handleClick(number)}
            onMouseEnter={() => editable && setHoveredStar(number)}
            onMouseLeave={() => editable && setHoveredStar(null)}
          />
        ) : (
          <img
            src="/star-empty.svg"
            style={styles}
            alt={number}
            onClick={() => handleClick(number)}
            onMouseEnter={() => editable && setHoveredStar(number)}
            onMouseLeave={() => editable && setHoveredStar(null)}
          />
        )}
      </div>
    );
  }

  useEffect(() => {
    if (showLoginMessage) {
      toast.error("Please login to rate");
    }
  }, [showLoginMessage]);

  const shouldShowComment = location.pathname.includes('/product/');

  return (
    <div className={classes.rating}>
      <div className={classes.stars}>
        {[1, 2, 3, 4, 5].map((number) => (
          <Star key={number} number={number} />
        ))}
      </div>

      {shouldShowComment && showComment && (
        <div className={classes.commentSection}>
          <textarea
            className={classes.commentInput}
            value={comment}
            onChange={onCommentChange}
            placeholder="Add a comment..."
            rows="3"
          />
          <button className={classes.addButton} onClick={onAddComment}>
            Add Comment
          </button>

          <div className={classes.commentList}>
            <h4>Comments</h4>
            {comments.length > 0 ? (
              comments.map((c, index) => (
                <div key={index} className={classes.commentItem}>
                  <strong>{c.userId?.name || 'Unknown User'}:</strong>
                  <p>{c.content}</p>
                  <small>{new Date(c.createdAt).toLocaleString()}</small>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

StarRating.defaultProps = {
  size: 18,
  editable: false,
  showComment: true,
  comments: [],
};
