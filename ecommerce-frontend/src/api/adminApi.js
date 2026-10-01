import axiosClient from './axiosClient';

export const adminApi = {
  getStats: () => axiosClient.get('/admin/stats'),
  getUsers: () => axiosClient.get('/admin/users'),
  updateUserRole: (id, role) => axiosClient.put(`/admin/users/${id}/role`, { role }),
  getOrders: () => axiosClient.get('/admin/orders'),
  updateOrderStatus: (id, status, paymentStatus) => axiosClient.put(`/admin/orders/${id}/status`, { status, paymentStatus }),
};
