import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getVoucherById,
  createVoucher,
  updateVoucher
} from '../../services/voucherService';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import classes from './voucherEdit.module.css';
import { toast } from 'react-toastify';

export default function EditVoucherPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (!isEdit) return;
    getVoucherById(id).then(voucher => {
      if (!voucher) return;
      reset({
        code: voucher.code,
        discountPercent: voucher.discountPercent,
        startDate: voucher.startDate?.split('T')[0],
        expiryDate: voucher.expiryDate?.split('T')[0],
        minOrderAmount: voucher.minOrderAmount,
        usageLimit: voucher.usageLimit
      });
    });
  }, [id, reset]);

    const onSubmit = async (data) => {
        const payload = {
            code: data.code,
            discountPercent: Number(data.discountPercent),
            startDate: new Date(data.startDate),
            expiryDate: new Date(data.expiryDate),
            usageLimit: Number(data.usageLimit),
            minOrderAmount: Number(data.minOrderAmount),
        };

        console.log("Submitting payload:", payload);

        if (isEdit) {
            await updateVoucher(id, payload);
            toast.success('Voucher updated!');
        } else {
            await createVoucher(payload);
            toast.success('Voucher created!');
        }

        navigate('/admin/vouchers');
        };



  return (
    <div className={classes.container}>
      <h2>{isEdit ? 'Edit' : 'Create'} Voucher</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <Input
          label="Voucher Code"
          type="text"
          {...register('code', { required: true })}
          error={errors.code}
        />
        <Input
          label="Discount (%)"
          type="number"
          {...register('discountPercent', { required: true, min: 1 })}
          error={errors.discountPercent}
        />
        <Input
            label="Start Date"
            type="date"
            {...register('startDate', { required: true })}
            error={errors.startDate}
            />

            <Input
            label="Expiry Date"
            type="date"
            {...register('expiryDate', { required: true })}
            error={errors.expiryDate}
            />
        <Input
          label="Min Order Amount"
          type="number"
          {...register('minOrderAmount', { required: true })}
          error={errors.minOrderAmount}
        />
       <Input
            label="Usage Limit"
            type="number"
            {...register('usageLimit', { required: true, min: 1 })}
            error={errors.usageLimit}
        />
        <Button type="submit" text={isEdit ? 'Update' : 'Create'} />
      </form>
    </div>
  );
}
