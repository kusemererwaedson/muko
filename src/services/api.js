import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const feeAPI = {
  getDashboard: () => api.get('/fees/dashboard'),
  
  // Fee Types
  getTypes: () => api.get('/fees/types'),
  createType: (data) => api.post('/fees/types', data),
  
  // Fee Groups
  getGroups: () => api.get('/fees/groups'),
  createGroup: (data) => api.post('/fees/groups', data),
  
  // Fee Allocations
  getAllocations: () => api.get('/fees/allocations'),
  createAllocation: (data) => api.post('/fees/allocations', data),
  
  // Fee Payments
  getPayments: () => api.get('/fees/payments'),
  createPayment: (data) => api.post('/fees/payments', data),
  
  // Send Reminders
  sendReminders: () => api.post('/fees/send-reminders'),
};

export const accountingAPI = {
  getAccounts: () => api.get('/accounting/accounts'),
  createAccount: (data) => api.post('/accounting/accounts', data),
  getVoucherHeads: () => api.get('/accounting/voucher-heads'),
  createVoucherHead: (data) => api.post('/accounting/voucher-heads', data),
  getTransactions: () => api.get('/accounting/transactions'),
  createTransaction: (data) => api.post('/accounting/transactions', data),
};

export const communicationAPI = {
  getEmailLogs: () => api.get('/communications/email-logs'),
  sendBulkReminders: (data) => api.post('/communications/bulk-reminders', data),
};

export default api;