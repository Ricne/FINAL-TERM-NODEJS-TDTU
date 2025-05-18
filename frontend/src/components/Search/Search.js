import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './search.module.css';

export default function Search({ margin, placeholder = 'Search Products' }) {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const search = () => {
    const trimmedTerm = term.trim();
    if (trimmedTerm) {
      navigate(`/products?searchTerm=${encodeURIComponent(trimmedTerm)}`);
    } else {
      navigate('/products');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTerm(value);
    if (value.trim() === '') {
      navigate('/products');
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <div className={classes.container} style={{ margin }}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
        value={term}
      />
      <button onClick={search}>Search</button>
    </div>
  );
}