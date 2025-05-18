import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// GET all products with pagination
export const getAll = async (page = 1, limit = 10) => {
  const { data } = await axios.get(`${API_URL}/api/products?page=${page}&limit=${limit}`);
  return data; // { data: [...], totalPages, page, ... }
};

// Search products by term with pagination
export const search = async (searchTerm, page = 1, limit = 10) => {
  const { data } = await axios.get(`${API_URL}/api/products/search/${searchTerm}?page=${page}&limit=${limit}`);
  return data; // same format
};

// Get all tags (no pagination)
export const getAllTags = async () => {
  const { data } = await axios.get(`${API_URL}/api/products/tags`);
  return data;
};

// Get all products by tag with pagination
export const getAllByTag = async (tag, page = 1, limit = 10) => {
  if (tag === 'All') return getAll(page, limit);
  const { data } = await axios.get(`${API_URL}/api/products/tag/${tag}?page=${page}&limit=${limit}`);
  return data;
};

// Get product by ID
export const getById = async (productId) => {
  const { data } = await axios.get(`${API_URL}/api/products/${productId}`);
  return data;
};

// Delete product by ID
export async function deleteById(productId) {
  await axios.delete(`${API_URL}/api/products/${productId}`);
}

// Update product
export async function update(product) {
  await axios.put(`${API_URL}/api/products`, product);
}

// Add new product
export async function add(product) {
  const { data } = await axios.post(`${API_URL}/api/products`, product);
  return data;
}

// Get ratings for a product
export const getProductRatings = async (productId) => {
  const { data } = await axios.get(`${API_URL}/api/products/${productId}/ratings`);
  return data;
};

// Rate a product
export const rateProduct = async (productId, rating) => {
  const response = await axios.put(`${API_URL}/api/products/rate/${productId}`, { stars: rating });
  return response.data;
};

// Add a comment to product
export const addComment = async (productId, userId, content) => {
  const { data } = await axios.post(`${API_URL}/api/products/${productId}/comments`, { userId, content });
  return data;
};

// Get comments for a product
export const getComments = async (productId) => {
  const { data } = await axios.get(`${API_URL}/api/products/${productId}/comments`);
  return data;
};