import React, { useState } from 'react';
import classes from './filterBar.module.css';
import StarRating from '../../components/StarRating/StarRating';
import Tags from '../../components/Tags/Tags';

export default function FilterBar({ availableTags, onFilterChange }) {
    const [selectedStars, setSelectedStars] = useState(null);
    const [selectedTag, setSelectedTag] = useState(null);
  
    const handleStarChange = (stars) => {
      setSelectedStars(stars);
      onFilterChange({ stars, tag: selectedTag });
    };
  
    const handleTagChange = (tagName) => {
      const tag = selectedTag === tagName ? null : tagName;
      setSelectedTag(tag);
      onFilterChange({ stars: selectedStars, tag });
    };
  
    const handleClearFilters = () => {
      setSelectedStars(null);
      setSelectedTag(null);
      onFilterChange({ stars: null, tag: null });
    };
  
    return (
      <div className={classes.filterBar}>
        <div className={classes.header}>
          <h4>Filters</h4>
          <button className={classes.clearButton} onClick={handleClearFilters}>
            Clear All Filters
          </button>
        </div>
  
        <div className={classes.filterSection}>
          <h4>Filter by Star Rating</h4>
          <div className={classes.stars}>
            {[5, 4, 3, 2, 1].map((star) => (
              <div
                key={star}
                className={`${classes.starOption} ${selectedStars === star ? classes.active : ''}`}
                onClick={() => handleStarChange(star)}
              >
                <StarRating
                  stars={star}
                  size={20}
                  editable={false}
                  showComment={false}
                />
              </div>
            ))}
          </div>
        </div>
  
        <div className={classes.filterSection}>
          <h4>Filter by Origin</h4>
          <div className={classes.tags}>
            {availableTags.map((tag) => (
              <div
                key={tag.name}
                className={`${classes.tagOption} ${selectedTag === tag.name ? classes.active : ''}`}
                onClick={() => handleTagChange(tag.name)}
              >
                {tag.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }