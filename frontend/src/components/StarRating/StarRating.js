import React, { useState, useEffect } from 'react';
import classes from './starRating.module.css';
import { toast } from 'react-toastify';

export default function StarRating({
  stars,
  size,
  onRatingChange,
  editable,
  isLoggedIn
}) {
  const [hoveredStar, setHoveredStar] = useState(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

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

  return (
    <div className={classes.rating}>
      <div className={classes.stars}>
        {[1, 2, 3, 4, 5].map((number) => (
          <Star key={number} number={number} />
        ))}
      </div>
    </div>
  );
}

StarRating.defaultProps = {
  size: 18,
  editable: false,
};
