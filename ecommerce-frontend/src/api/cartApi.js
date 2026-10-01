import axiosClient from './axiosClient';

export const cartApi = {
  getCart: () => axiosClient.get('/cart'),
  addItem: (productId, quantity = 1) => axiosClient.post('/cart/items', { productId, quantity }),
  updateQuantity: (itemId, quantity) => axiosClient.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => axiosClient.delete(`/cart/items/${itemId}`),
  clearCart: () => axiosClient.delete('/cart/clear'),
};
