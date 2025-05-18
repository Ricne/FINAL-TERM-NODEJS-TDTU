import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { getVoucherByCode } from '../../services/voucherService';
import { toast } from 'react-toastify';

export default function VoucherInput({ onSuccess }) {
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!voucherCode.trim()) {
      toast.warning('Please enter a voucher code');
      return;
    }

    setLoading(true);

    try {
      const voucherData = await getVoucherByCode(voucherCode);

      if (!voucherData) {
        toast.error('Invalid voucher code!');
        return;
      }

      const now = new Date();

      if (voucherData.expiryDate && new Date(voucherData.expiryDate) < now) {
        toast.warning('This voucher has expired.');
        return;
      }

      if (voucherData.usageLimit && voucherData.usedCount >= voucherData.usageLimit) {
        toast.warning('This voucher has reached its usage limit.');
        return;
      }

      onSuccess(voucherData);
      toast.success('Voucher applied successfully!');
    } catch (error) {
      console.error('Error applying voucher:', error);
      toast.error('Failed to apply voucher!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Input
        label="Enter voucher code"
        value={voucherCode}
        onChange={(e) => setVoucherCode(e.target.value)}
      />
      <Button onClick={handleApply} disabled={loading}>
        {loading ? 'Applying...' : 'Apply'}
      </Button>
    </div>
  );
}
