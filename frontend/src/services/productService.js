import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Helper: chuẩn hóa phản hồi từ backend (dạng có hoặc không có .data.data)
const normalizeResponse = (res) => {
  const rawData = res?.data;
  const dataArray =
    Array.isArray(rawData?.data) ? rawData.data :
    Array.isArray(rawData) ? rawData :
    [];

  const totalPages = rawData?.totalPages || res?.totalPages || 1;

  return { data: dataArray, totalPages };
};

// ============================
//         API CALLS
// ============================

export const getAll = async (page = 1, limit = 1000) => {
  try {
    const res = await axios.get(`${API_URL}/api/products?page=${page}&limit=${limit}`);
    return normalizeResponse(res);
  } catch (err) {
    console.error('getAll failed:', err);
    return { data: [], totalPages: 1 };
  }
};

export const search = async (searchTerm, page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/api/products/search/${searchTerm}?page=${page}&limit=${limit}`);
    return normalizeResponse(res);
  } catch (err) {
    console.error('search failed:', err);
    return { data: [], totalPages: 1 };
  }
};

export const getAllTags = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/products/tags`);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('getAllTags failed:', err);
    return [];
  }
};

export const getAllByTag = async (tag, page = 1, limit = 10) => {
  try {
    if (tag === 'All') return getAll(page, limit);
    const res = await axios.get(`${API_URL}/api/products/tag/${tag}?page=${page}&limit=${limit}`);
    return normalizeResponse(res);
  } catch (err) {
    console.error('getAllByTag failed:', err);
    return { data: [], totalPages: 1 };
  }
};

export const getById = async (productId) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/products/${productId}`);
    return data;
  } catch (err) {
    console.error('getById failed:', err);
    return null;
  }
};

export const deleteById = async (productId) => {
  try {
    await axios.delete(`${API_URL}/api/products/${productId}`);
  } catch (err) {
    console.error('deleteById failed:', err);
  }
};

export const update = async (product) => {
  try {
    await axios.put(`${API_URL}/api/products`, product);
  } catch (err) {
    console.error('update failed:', err);
  }
};

export const add = async (product) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/products`, product);
    return data;
  } catch (err) {
    console.error('add failed:', err);
    return null;
  }
};

export const getProductRatings = async (productId) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/products/${productId}/ratings`);
    return data;
  } catch (err) {
    console.error('getProductRatings failed:', err);
    return [];
  }
};

export const rateProduct = async (productId, rating) => {
  try {
    const { data } = await axios.put(`${API_URL}/api/products/rate/${productId}`, { stars: rating });
    return data;
  } catch (err) {
    console.error('rateProduct failed:', err);
    return null;
  }
};

export const addComment = async (productId, userId, content) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/products/${productId}/comments`, { userId, content });
    return data;
  } catch (err) {
    console.error('addComment failed:', err);
    return [];
  }
};

export const getComments = async (productId) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/products/${productId}/comments`);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('getComments failed:', err);
    return [];
  }
};
