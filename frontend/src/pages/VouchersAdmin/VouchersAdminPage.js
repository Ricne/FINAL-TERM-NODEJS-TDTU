import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllVouchers, deleteVoucher } from '../../services/voucherService';
import Button from '../../components/Button/Button';
import classes from './vouchersAdminPage.module.css';
import { toast } from 'react-toastify';

export default function AdminVoucherPage() {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    const data = await getAllVouchers();
    setVouchers(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this voucher?')) return;
    await deleteVoucher(id);
    toast.success('Voucher deleted successfully!');
    fetchVouchers();
  };

  return (
    <div className={classes.container}>
      <h2>🎁 All Vouchers</h2>
      <Link to="/admin/voucher/new">
        <Button text="➕ Add Voucher" />
      </Link>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount</th>
            <th>Expiration</th>
            <th>Amount voucher</th>
            <th>Min Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map(voucher => (
            <tr key={voucher._id}>
              <td>{voucher.code}</td>
              <td>{voucher.discountPercent}%</td>
              <td>{new Date(voucher.expiryDate).toLocaleDateString()}</td> 
              <td>{voucher.usageLimit}</td>
              <td>{voucher.minOrderAmount}</td> 
              <td>
                <Link to={`/admin/voucher/${voucher._id}`}>✏️</Link>
                <button onClick={() => handleDelete(voucher._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
