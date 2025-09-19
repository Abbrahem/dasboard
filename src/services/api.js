import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration - but not for login/register requests
    if (error.response?.status === 401 && 
        !error.config?.url?.includes('/auth/login') && 
        !error.config?.url?.includes('/auth/register')) {
      localStorage.removeItem('token');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/change-password', { currentPassword, newPassword }),
  
  // Set auth token
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },
  
  // Remove auth token
  removeAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/stats'),
  getUsersByRole: (role) => api.get(`/users/role/${role}`),
  getDoctors: () => api.get('/users/role/doctors'),
  getReceptionists: () => api.get('/users/role/receptionists'),
  resetUserPassword: (id, newPassword) => 
    api.put(`/users/${id}/reset-password`, { newPassword }),
  getUserStats: () => api.get('/users/stats/overview')
};

// Patients API
export const patientsAPI = {
  getPatients: (params) => api.get('/patients', { params }),
  getPatient: (id) => api.get(`/patients/${id}`),
  createPatient: (patientData) => api.post('/patients', patientData),
  updatePatient: (id, patientData) => api.put(`/patients/${id}`, patientData),
  deletePatient: (id) => api.delete(`/patients/${id}`),
  restorePatient: (id) => api.put(`/patients/${id}/restore`),
  getPatientHistory: (id) => api.get(`/patients/${id}/history`),
  addMedicalHistory: (id, historyData) => 
    api.post(`/patients/${id}/history`, historyData),
  searchPatients: (query) => api.get(`/patients/search/${query}`)
};

// Doctors API
export const doctorsAPI = {
  getDoctors: (params) => api.get('/users/role/doctors', { params }),
  getDoctor: (id) => api.get(`/users/${id}`),
  getDoctorSchedule: (id, params) => api.get(`/sessions/doctor/${id}`, { params }),
  getDoctorPatients: (id, params) => api.get(`/patients`, { params: { ...params, doctor: id } }),
  getDoctorStats: (id, params) => api.get(`/users/${id}/stats`, { params }),
  getSpecializations: () => api.get('/users/meta/specializations'),
  getDepartments: () => api.get('/users/meta/departments')
};

// Sessions API
export const sessionsAPI = {
  getSessions: (params) => api.get('/sessions', { params }),
  getSession: (id) => api.get(`/sessions/${id}`),
  createSession: (sessionData) => api.post('/sessions', sessionData),
  updateSession: (id, sessionData) => api.put(`/sessions/${id}`, sessionData),
  deleteSession: (id) => api.delete(`/sessions/${id}`),
  startSession: (id) => api.put(`/sessions/${id}/start`),
  completeSession: (id, completionData) => 
    api.put(`/sessions/${id}/complete`, completionData),
  cancelSession: (id, reason) => api.put(`/sessions/${id}/cancel`, { reason }),
  getSessionsByPatient: (patientId) => api.get(`/sessions/patient/${patientId}`),
  getSessionsByDoctor: (doctorId, params) => 
    api.get(`/sessions/doctor/${doctorId}`, { params }),
  getTodaySessions: () => api.get('/sessions/schedule/today')
};

// Payments API
export const paymentsAPI = {
  getPayments: (params) => api.get('/payments', { params }),
  getPayment: (id) => api.get(`/payments/${id}`),
  createPayment: (paymentData) => api.post('/payments', paymentData),
  updatePayment: (id, paymentData) => api.put(`/payments/${id}`, paymentData),
  processPayment: (id, transactionId) => 
    api.put(`/payments/${id}/process`, { transactionId }),
  refundPayment: (id, refundAmount, reason) => 
    api.put(`/payments/${id}/refund`, { refundAmount, reason }),
  cancelPayment: (id, reason) => api.put(`/payments/${id}/cancel`, { reason }),
  getPaymentsByPatient: (patientId) => api.get(`/payments/patient/${patientId}`),
  getOverduePayments: () => api.get('/payments/status/overdue'),
  getPaymentStats: (params) => api.get('/payments/analytics/stats', { params })
};

// Employees API
export const employeesAPI = {
  getEmployees: (params) => api.get('/employees', { params }),
  getEmployee: (id) => api.get(`/employees/${id}`),
  getEmployeesByRole: (role) => api.get(`/employees/role/${role}`),
  getReceptionists: () => api.get('/employees/category/receptionists'),
  getAdmins: () => api.get('/employees/category/admins'),
  getEmployeeStats: () => api.get('/employees/analytics/stats'),
  getEmployeeActivity: (id, params) => 
    api.get(`/employees/${id}/activity`, { params })
};

// Dashboard API
export const dashboardAPI = {
  getOverview: () => api.get('/dashboard/overview'),
  getTodayAppointments: () => api.get('/dashboard/today-appointments'),
  getRecentPatients: (params) => api.get('/dashboard/recent-patients', { params }),
  getSessionStats: (params) => api.get('/dashboard/session-stats', { params }),
  getRevenueStats: (params) => api.get('/dashboard/revenue-stats', { params }),
  getUpcomingAppointments: (params) => 
    api.get('/dashboard/upcoming-appointments', { params }),
  getActivityFeed: (params) => api.get('/dashboard/activity-feed', { params }),
  getReports: (params) => api.get('/dashboard/reports', { params })
};

// Health check
export const healthAPI = {
  check: () => api.get('/health')
};

// Export default api instance
export default api;
