import React, { useEffect, useState } from 'react';
import { getAll } from '../../services/productService';
import Price from '../../components/Price/Price';
import { Link } from 'react-router-dom';
import classes from './homePage.module.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const res = await getAll();
      const data = res?.data?.data || res?.data || [];
      setProducts(data);
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    // Tạo bóng chuột
    const cursor = document.createElement('div');
    cursor.className = 'cursor-effect';
    document.body.appendChild(cursor);

    const handleMouseMove = (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeChild(cursor);
    };
  }, []);

  const renderSection = (title, productList, tagName) => {
    const top4 = productList.slice(0, 4);

    return (
      <section className={classes.homeSection} key={title}>
        <h2 style={{ textTransform: 'capitalize' }}>{title}</h2>
        <div className={classes.productGrid}>
          {top4.map((p) => (
            <Link to={`/product/${p.id}`} className={classes.productCard} key={p.id}>
              <img src={p.imageUrls?.[0] || 'https://via.placeholder.com/150'} alt={p.name} />
              <h3>{p.name}</h3>
              <Price price={p.price} />
            </Link>
          ))}
        </div>

        {productList.length > 4 && tagName && (
          <div style={{ marginTop: '1rem' }}>
            <Link to={`/products?tag=${encodeURIComponent(tagName)}`} style={{ color: '#e72929', fontWeight: 'bold' }}>
              Show more →
            </Link>
          </div>
        )}
      </section>
    );
  };

  // Dữ liệu các nhóm sản phẩm
  const newProducts = [...products].sort(
    (a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id)
  );
  const laptops = products.filter(p => p.name?.toLowerCase().includes('laptop'));
  const monitors = products.filter(p => p.name?.toLowerCase().includes('monitor'));
  const hardDrives = products.filter(p =>
    p.name?.toLowerCase().includes('hard drive') || p.name?.toLowerCase().includes('hdd')
  );

  return (
    <div className={classes.homepage}>
      <h1 className={classes.homeTitle}>WELCOME TO TECHNOLOGY SHOP</h1>
      {renderSection('New Products', newProducts, 'new')}
      {renderSection('Laptops', laptops, 'Laptop')}
      {renderSection('Monitors', monitors, 'Monitor')}
      {renderSection('Hard Drives', hardDrives, 'Harddrive')}
    </div>
  );
}
