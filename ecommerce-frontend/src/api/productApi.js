import axiosClient from './axiosClient';

export const productApi = {
  getProducts: (params = {}) => axiosClient.get('/products', { params }),
  getProductById: (id) => axiosClient.get(`/products/${id}`),
  getFeatured: () => axiosClient.get('/products/featured'),
  getTrending: () => axiosClient.get('/products/trending'),
  getBrands: () => axiosClient.get('/products/brands'),
  createProduct: (data) => axiosClient.post('/products', data),
  updateProduct: (id, data) => axiosClient.put(`/products/${id}`, data),
  deleteProduct: (id) => axiosClient.delete(`/products/${id}`),
};
