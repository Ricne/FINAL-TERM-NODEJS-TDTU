import React, { useState } from 'react';
import { useLoading } from '../../hooks/useLoading';
import { useCart } from '../../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { pay } from '../../services/orderService';
import Price from '../../components/Price/Price'; 


export default function FakePaypalButtons({ order }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h3>Complete Your Payment</h3>
      <MockButtons order={order} />
    </div>
  );
}

function MockButtons({ order }) {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [isPaying, setIsPaying] = useState(false);

  const handleMockPay = async () => {
    setIsPaying(true);
    showLoading();

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const fakePayment = { id: 'FAKE_PAYPAL_' + Date.now() };

      const orderId = await pay(fakePayment.id);

      clearCart();
      toast.success('Payment Success', { autoClose: 3000 });
      navigate('/track/' + orderId);
    } catch (err) {
      toast.error('Payment Failed', { autoClose: 3000 });
    } finally {
      setIsPaying(false);
      hideLoading();
    }
  };

  const total = order?.totalAfterDiscount ?? order?.totalPrice ?? 0;

  return (
    <button
      onClick={handleMockPay}
      style={{
        backgroundColor: '#0070BA',
        color: 'white',
        padding: '12px 24px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '10px',
      }}
      disabled={isPaying}
    >
      {isPaying ? 'Processing...' : (
        <>
          Pay <Price price={total} />
        </>
      )}
    </button>
  );
}
