import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const createOrder = async order => {
  try {
    const { data } = await axios.post(`${API_URL}/api/orders/create`, order);
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error; 
  }
};

export const getNewOrderForCurrentUser = async () => {
  const { data } = await axios.get(`${API_URL}/api/orders/newOrderForCurrentUser`);
  return data;
};

export const pay = async paymentId => {
  try {
    const { data } = await axios.put(`${API_URL}/api/orders/pay`, { paymentId });
    return data;
  } catch (error) {
    console.error('Error during payment:', error);
    throw error;
  }
};

export const trackOrderById = async orderId => {
  const { data } = await axios.get(`${API_URL}/api/orders/track/${orderId}`);
  return data;
};

export const getAll = async state => {
  const { data } = await axios.get(`${API_URL}/api/orders/${state ?? ''}`);
  return data;
};

export const getAllStatus = async () => {
  const { data } = await axios.get(`${API_URL}/api/orders/allstatus`);
  return data;
};