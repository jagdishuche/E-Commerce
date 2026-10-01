import axiosClient from './axiosClient';

export const aiApi = {
  sendMessage: (message, currentPath = '', conversationId = '') =>
    axiosClient.post('/ai/chat', { message, currentPath, conversationId }),
  getSuggestions: () => axiosClient.get('/ai/suggestions'),
};
