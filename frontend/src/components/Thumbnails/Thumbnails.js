import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Price from '../Price/Price';
import StarRating from '../../components/StarRating/StarRating';
import FilterBar from '../../components/FilterBar/FilterBar';
import classes from './thumbnails.module.css';

export default function Thumbnails({ products: initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [sortOption, setSortOption] = useState('');
  const [filter, setFilter] = useState({ stars: null, tag: null });

  useEffect(() => {
    setProducts(initialProducts);
    setFilteredProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const applyFilterAndSort = () => {
      let updatedProducts = [...products];

      // Áp dụng filter
      if (filter.stars) {
        updatedProducts = updatedProducts.filter((product) => product.stars >= filter.stars);
      }
      if (filter.tag) {
        updatedProducts = updatedProducts.filter((product) =>
          product.origins.includes(filter.tag)
        );
      }

      // Áp dụng sort
      switch (sortOption) {
        case 'name-asc':
          updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'price-asc':
          updatedProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          updatedProducts.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }

      setFilteredProducts(updatedProducts);
    };

    applyFilterAndSort();
  }, [filter, sortOption, products]);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Lấy danh sách tags từ products (lấy unique tag)
  const availableTags = Array.from(
    new Set(initialProducts.flatMap((product) => product.origins))
  ).map((tag) => ({ name: tag }));

  // Kiểm tra xem product có ảnh hợp lệ không
  const getImageUrl = (product) => {
    // Nếu product có imageUrls và mảng đó có phần tử, chọn ảnh đầu tiên
    if (product.imageUrls && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }
    // Nếu không có ảnh trong imageUrls, sử dụng imageUrl (nếu có)
    if (product.imageUrl) {
      return product.imageUrl;
    }
    // Nếu không có ảnh, sử dụng ảnh mặc định
    return 'https://cdn3.iconfinder.com/data/icons/it-and-ui-mixed-filled-outlines/48/default_image-1024.png';
  };

  return (
    <div>
      {/* Filter bar */}
      <FilterBar availableTags={availableTags} onFilterChange={handleFilterChange} />

      {/* Sort select */}
      <div className={classes.sortContainer}>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className={classes.sortSelect}
        >
          <option value="">Sort products by...</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      {/* Product list */}
      <ul className={classes.list}>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <Link to={`/product/${product.id}`}>
              <img
                className={classes.image}
                src={getImageUrl(product)}  
                alt={product.name}
              />
              <div className={classes.content}>
                <div className={classes.name}>{product.name}</div>
                <div className={classes.stars}>
                  <StarRating stars={product.stars} />
                </div>
                <div className={classes.product_item_footer}>
                  <div className={classes.origins}>
                    {product.origins.map((origin) => (
                      <span key={origin}>{origin}</span>
                    ))}
                  </div>
                  <div className={classes.description}>
                    <span>👉</span>
                    {product.description}
                  </div>
                </div>
                <div className={classes.price}>
                  <Price price={product.price} />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
