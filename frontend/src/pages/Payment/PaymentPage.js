import React, { useState, useEffect } from 'react';
import classes from './paymentPage.module.css';
import { getNewOrderForCurrentUser } from '../../services/orderService';
import Title from '../../components/Title/Title';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Map from '../../components/Map/Map';
import FakePaypalButtons from '../../components/PaypalButtons/FakePaypalButtons';

export default function PaymentPage() {
  const [order, setOrder] = useState();

  useEffect(() => {
    getNewOrderForCurrentUser().then(setOrder);
  }, []);

  if (!order) return null;

  const discount = order.discount || 0;
  const totalPrice = order.totalPrice || 0;
  const totalAfterDiscount = order.totalAfterDiscount || totalPrice - discount;

  const orderWithDiscount = { ...order, discount, totalAfterDiscount };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Title title="Order Form" fontSize="1.6rem" />
        <div className={classes.summary}>
          <div>
            <h3>Name:</h3>
            <span>{order.name}</span>
          </div>
          <div>
            <h3>Address:</h3>
            <span>{order.address}</span>
          </div>
        </div>
        <OrderItemsList order={orderWithDiscount} />
      </div>

      <div className={classes.buttons_container}>
        <FakePaypalButtons order={orderWithDiscount} />
      </div>
    </div>
  );
}