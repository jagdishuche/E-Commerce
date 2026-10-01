import axiosClient from './axiosClient';

export const orderApi = {
  createOrder: (orderData) => axiosClient.post('/orders', orderData),
  getUserOrders: () => axiosClient.get('/orders'),
  getOrderById: (id) => axiosClient.get(`/orders/${id}`),
};
