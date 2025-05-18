import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import classes from './header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <Link to="/" className={classes.logo}>
          Technology Shop
        </Link>

        {/* LEFT: Home, Product */}
        <ul className={classes.leftNav}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Product</Link></li>
        </ul>

        {/* RIGHT: User / Login, Cart */}
        <ul className={classes.rightNav}>
          {user ? (
            <li className={classes.menu_container}>
              <Link to="/dashboard">{user.name}</Link>
              <div className={classes.menu}>
                <Link to="/profile">Profile</Link>
                <Link to="/orders">Orders</Link>
                <a onClick={logout}>Logout</a>
              </div>
            </li>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
          <li>
            <Link to="/cart">
              Cart
              {cart.totalCount > 0 && (
                <span className={classes.cart_count}>{cart.totalCount}</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
