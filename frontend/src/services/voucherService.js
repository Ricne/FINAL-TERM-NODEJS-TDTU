import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const BASE = `${API_URL}/api/vouchers`;

export const getAllVouchers = async () => {
  const res = await axios.get(BASE);
  return res.data;
};

export const getVoucherById = async (id) => {
  const res = await axios.get(`${BASE}/${id}`);
  return res.data;
};

export const createVoucher = async (data) => {
  const res = await axios.post(BASE, data);
  return res.data;
};

export const updateVoucher = async (id, data) => {
  const res = await axios.put(`${BASE}/${id}`, data);
  return res.data;
};

export const deleteVoucher = async (id) => {
  await axios.delete(`${BASE}/${id}`);
};

export const getVoucherByCode = async (code) => {
  try {
    console.log('Fetching voucher with code:', code);
    const response = await axios.get(`${BASE}/code/${code}`);
    console.log('Voucher data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching voucher:', error);
    throw error;
  }
};

export const increaseVoucherUsage = async (id) => {
  if (!id) {
    console.error('Cannot increase voucher usage: voucher ID is undefined');
    return null;
  }

  try {
    console.log('Increasing usage for voucher ID:', id);
    const response = await axios.patch(`${BASE}/${id}/use`);
    console.log('Usage increased successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error increasing voucher usage:', error);
    throw error;
  }
};