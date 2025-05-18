import React from 'react';
import { Link } from 'react-router-dom';
import Price from '../Price/Price';
import classes from './orderItemsList.module.css';

export default function OrderItemsList({ order }) {
  const items = order?.items || [];
  const discount = order?.discount || 0;
  const totalPrice = order?.totalPrice || 0;
  const totalAfterDiscount = order?.totalAfterDiscount ?? totalPrice - discount;

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => {
          if (!item?.product) return null;

          return (
            <tr key={item.product.id || index}>
              <td>
                <Link to={`/product/${item.product.id}`}>
                  <img src={item.product.imageUrls?.[0]} alt={item.product.name} />
                </Link>
              </td>
              <td>{item.product.name}</td>
              <td><Price price={item.product.price} /></td>
              <td>{item.quantity}</td>
              <td><Price price={item.price} /></td>
            </tr>
          );
        })}

        <tr>
          <td colSpan="3"></td>
          <td><strong>Total:</strong></td>
          <td><Price price={totalPrice} /></td>
        </tr>

        {discount > 0 && (
          <tr>
            <td colSpan="3"></td>
            <td><strong>Voucher Discount:</strong></td>
            <td>-<Price price={discount} /></td>
          </tr>
        )}

        <tr>
          <td colSpan="3"></td>
          <td><strong>Total After Discount:</strong></td>
          <td><Price price={totalAfterDiscount} /></td>
        </tr>
      </tbody>
    </table>
  );
}
