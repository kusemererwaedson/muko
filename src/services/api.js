//src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Skip redirect if the request is logout or login
    if (error.response?.status === 401 && originalRequest.url !== '/logout' && originalRequest.url !== '/login') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout').catch(error => {
    console.warn('Logout API call failed:', error);
    return Promise.resolve();
  }),
  getUser: () => api.get('/user'),
};

export const studentAPI = {
  getAll: (params = {}) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  bulkCreate: (data) => api.post('/students/bulk', data),
  
  // Classes and Streams
  getClasses: () => api.get('/students/classes'),
  getStreams: (classId) => api.get(`/students/streams/${classId || ''}`),
  
  // Filtering
  search: (params) => api.get('/students', { params }),
  
  // Import/Export with proper blob handling
  exportExcel: (format = 'csv') => {
    console.log('Exporting students as', format);
    return api.get('/students/export', { 
      params: { format },
      responseType: 'blob',
      headers: {
        'Accept': format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'text/csv'
      }
    });
  },
  
  importExcel: (formData) => {
    console.log('Importing students...');
    return api.post('/students/import', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      },
      // Don't set responseType to blob for import - we need JSON response
    });
  },
  
  downloadTemplate: () => {
    console.log('Downloading student import template...');
    return api.get('/students/template', { 
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });
  },
  
  syncClasses: () => api.post('/students/sync-classes'),
};

export const feeAPI = {
  getDashboard: () => api.get('/fees/dashboard'),
  getReports: (params) => api.get('/fees/reports', { params }),

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

// accounting
export const accountingAPI = {
  getAccounts: () => api.get('/accounting/accounts'),
  createAccount: (data) => api.post('/accounting/accounts', data),
  getVoucherHeads: () => api.get('/accounting/voucher-heads'),
  createVoucherHead: (data) => api.post('/accounting/voucher-heads', data),
  getTransactions: () => api.get('/accounting/transactions'),
  createTransaction: (data) => api.post('/accounting/transactions', data),
};

export const academicAPI = {
  // Classes
  getClasses: () => api.get('/academic/classes'),
  createClass: (data) => api.post('/academic/classes', data),
  updateClass: (id, data) => api.put(`/academic/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/academic/classes/${id}`),
  
  // Streams
  getStreams: () => api.get('/academic/streams'),
  createStream: (data) => api.post('/academic/streams', data),
  
  // Levels
  getLevels: () => api.get('/academic/levels'),
  createLevel: (data) => api.post('/academic/levels', data),
  
  // Terms
  getTerms: () => api.get('/academic/terms'),
  createTerm: (data) => api.post('/academic/terms', data),
  setCurrentTerm: (id) => api.put(`/academic/terms/${id}/set-current`),
};

export const communicationAPI = {
  getEmailLogs: () => api.get('/communications/email-logs'),
  sendBulkReminders: (data) => api.post('/communications/bulk-reminders', data),
  
  // SMS
  getSmsLogs: () => api.get('/communications/sms-logs'),
  sendSms: (data) => api.post('/communications/send-sms', data),
};

export default api;