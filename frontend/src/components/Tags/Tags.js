import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classes from './tags.module.css';

export default function Tags({ tags, forProductPage }) {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(prev => !prev);
  };

  return (
    <div className={classes.wrapper}>
      <button className={classes.showButton} onClick={toggleShowAll}>
        {showAll ? 'Collapse categories' : 'All categories'}
      </button>

      {showAll && (
        <div
          className={classes.container}
          style={{
            justifyContent: forProductPage ? 'start' : 'center',
          }}
        >
          {tags.map(tag => (
            <Link key={tag.name} to={`/tag/${tag.name}`}>
              {tag.name}
              {!forProductPage && ` (${tag.count})`}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
