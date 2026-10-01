import axiosClient from './axiosClient';

export const wishlistApi = {
  getWishlist: () => axiosClient.get('/wishlist'),
  addToWishlist: (productId) => axiosClient.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId) => axiosClient.delete(`/wishlist/${productId}`),
  checkWishlist: (productId) => axiosClient.get(`/wishlist/check/${productId}`),
};
