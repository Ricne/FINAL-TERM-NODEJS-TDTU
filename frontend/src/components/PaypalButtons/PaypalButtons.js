import React, { useEffect, useState } from 'react';
import { useLoading } from '../../hooks/useLoading';
import { pay } from '../../services/orderService';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function PaypalButtons({ order }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h3>Complete Your Payment</h3>
      <Buttons order={order} />
    </div>
  );
}

function Buttons({ order }) {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (isPaying) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [isPaying, showLoading, hideLoading]);

  const fakeCreateOrder = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: 'FAKE_ORDER_' + Date.now() });
      }, 500); 
    });
  };  

  const fakeCapturePayment = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() < 0.9
          ? resolve({ id: 'FAKE_PAYMENT_' + Date.now() })
          : reject(new Error('Payment failed'));
      }, 1500);
    });
  };  

  const onPay = async () => {
    try {
      setIsPaying(true);
      await fakeCreateOrder(); 
      const paymentData = await fakeCapturePayment();
  
      const orderId = await pay(paymentData.id); 
  
      clearCart(); 
      toast.success('Payment completed successfully!', { autoClose: 3000 });
      navigate('/track/' + orderId); 
    } catch (error) {
      toast.error('Payment failed. Please try again.', { autoClose: 3000 });
    } finally {
      setIsPaying(false);
    }
  };
  

  return (
    <button
      onClick={onPay}
      style={{
        backgroundColor: '#0070BA',
        color: 'white',
        padding: '12px 24px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '10px'
      }}
      disabled={isPaying}
    >
      {isPaying ? 'Processing...' : `Pay $${order.totalPrice}`}
    </button>
  );
}