import axios from 'axios';

const API_BASE_URL = 'http://localhost:5204/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Articles API
export const articlesAPI = {
  getAll: () => api.get('/articles'),
  getById: (id) => api.get(`/articles/${id}`),
  getByCategory: (category) => api.get(`/articles/category/${category}`),
  create: (article) => api.post('/articles', article),
  update: (id, article) => api.put(`/articles/${id}`, article),
  delete: (id) => api.delete(`/articles/${id}`),
};

// Videos API
export const videosAPI = {
  getAll: () => api.get('/videos'),
  getById: (id) => api.get(`/videos/${id}`),
  getByCategory: (category) => api.get(`/videos/category/${category}`),
  create: (video) => api.post('/videos', video),
  update: (id, video) => api.put(`/videos/${id}`, video),
  delete: (id) => api.delete(`/videos/${id}`),
};

// Questions API
export const questionsAPI = {
  getAll: () => api.get('/questions'),
  getById: (id) => api.get(`/questions/${id}`),
  getByCategory: (category) => api.get(`/questions/category/${category}`),
  create: (question) => api.post('/questions', question),
  addAnswer: (questionId, answer) => api.post(`/questions/${questionId}/answers`, answer),
  acceptAnswer: (questionId, answerId) => api.put(`/questions/${questionId}/answers/${answerId}/accept`),
  delete: (id) => api.delete(`/questions/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: (type) => api.get('/categories', { params: { type } }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
};

export default api;
