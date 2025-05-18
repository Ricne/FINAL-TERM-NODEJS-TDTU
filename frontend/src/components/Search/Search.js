import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './search.module.css';

Search.defaultProps = {
  searchRoute: '/search/',
  defaultRoute: '/',
  placeholder: 'Search Products',
};

export default function Search({
  searchRoute,
  defaultRoute,
  margin,
  placeholder,
}) {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();
  const { searchTerm } = useParams();

  useEffect(() => {
    setTerm(searchTerm ?? '');
  }, [searchTerm]);

  const search = () => {
    const trimmedTerm = term.trim(); // Bỏ khoảng trắng 2 đầu

    if (trimmedTerm) {
      navigate(searchRoute + encodeURIComponent(trimmedTerm));
    } else {
      navigate(defaultRoute);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setTerm(value);

    if (value.trim() === '') {
      navigate(defaultRoute); // Nếu clear hết input thì quay về sản phẩm bình thường
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