import axiosClient from './axiosClient';

export const reviewApi = {
  getProductReviews: (productId) => axiosClient.get(`/products/${productId}/reviews`),
  addReview: (productId, reviewData) => axiosClient.post(`/products/${productId}/reviews`, reviewData),
};
