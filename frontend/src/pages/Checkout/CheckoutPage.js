import React, { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { createOrder } from '../../services/orderService';
import { getVoucherByCode, increaseVoucherUsage } from '../../services/voucherService';
import classes from './checkoutPage.module.css';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import OrderItemsList from '../../components/OrderItemsList/OrderItemsList';
import Map from '../../components/Map/Map';
import VoucherInput from '../../components/Voucher/VoucherInput';

export default function CheckoutPage() {
  const { cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [addressLatLng, setAddressLatLng] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const totalPrice = calculateTotalPrice(cart.items);
  const totalAfterDiscount = totalPrice - discount;

  useEffect(() => {
    if (voucher) {
      const discountAmount = (totalPrice * voucher.discountPercent) / 100;
      setDiscount(discountAmount);
    } else {
      setDiscount(0);
    }
  }, [voucher, totalPrice]);

  const applyVoucher = async (code) => {
    try {
      const voucherData = await getVoucherByCode(code);
      if (!voucherData) {
        toast.error('Invalid voucher code!');
        setVoucher(null);
        return;
      }

      const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      const now = new Date();

      if (voucherData.expiryDate && new Date(voucherData.expiryDate) < now) {
        toast.warning('This voucher has expired.');
        setVoucher(null);
        return;
      }

      if (voucherData.minOrderAmount && totalPrice < voucherData.minOrderAmount) {
        toast.warning(`Order must be at least $${voucherData.minOrderAmount}`);
        setVoucher(null);
        return;
      }

      if (voucherData.minQuantity && totalQuantity < voucherData.minQuantity) {
        toast.warning(`Order must include at least ${voucherData.minQuantity} items.`);
        setVoucher(null);
        return;
      }

      if (voucherData.usageLimit && voucherData.usedCount >= voucherData.usageLimit) {
        toast.warning('This voucher has reached its usage limit.');
        setVoucher(null);
        return;
      }

      setVoucher(voucherData);
      toast.success('Voucher applied successfully!');
    } catch (err) {
      toast.error('Failed to apply voucher!');
      setVoucher(null);
    }
  };

  const submit = async (data) => {
    if (!addressLatLng) {
      toast.warning('Please select your location on the map.');
      return;
    }

    const newOrder = {
      items: cart.items,
      totalPrice,
      totalAfterDiscount,
      discount,
      voucherId: voucher?._id || null,
      name: data.name,
      address: data.address,
      addressLatLng,
    };

    try {
      await createOrder(newOrder);
      if (voucher?._id) await increaseVoucherUsage(voucher._id);
      navigate('/payment');
    } catch (err) {
      toast.error('Failed to create order');
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className={classes.container}>
      <div className={classes.content}>
        <Title title="Order Form" fontSize="1.6rem" />
        <div className={classes.inputs}>
          <Input
            defaultValue={user?.email || ''}
            label="Email"
            {...register('email', { required: true })}
            error={errors.email}
          />
          <Input
            defaultValue={user?.name || ''}
            label="Name"
            {...register('name', { required: true })}
            error={errors.name}
          />
          <Input
            defaultValue={user?.address || ''}
            label="Address"
            {...register('address', { required: true })}
            error={errors.address}
          />

          <VoucherInput onSuccess={(voucher) => setVoucher(voucher)} />
        </div>

        <OrderItemsList order={{ items: cart.items, discount, totalPrice, totalAfterDiscount }} />
      </div>

      <div>
        <Title title="Choose Your Location" fontSize="1.6rem" />
        <Map location={addressLatLng} onChange={setAddressLatLng} />
      </div>

      <div className={classes.buttons_container}>
        <Button type="submit" text="Go To Payment" width="100%" height="3rem" />
      </div>
    </form>
  );
}
