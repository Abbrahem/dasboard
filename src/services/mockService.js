// Mock service to replace API calls with local data operations
import { 
  mockUsers, 
  mockPatients, 
  mockSessions, 
  mockPayments,
  getPatientById,
  getDoctorById,
  getUserById,
  getSessionsByPatient,
  getSessionsByDoctor,
  getPaymentsByPatient,
  getPaymentsBySession,
  getDashboardStats,
  generateMockSession,
  generateMockPatient,
  generateMockPayment
} from '../data/mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock response format
const createResponse = (data, message = 'Success') => ({
  data: {
    success: true,
    message,
    data
  }
});

// Auth Service
export const authService = {
  login: async (email, password) => {
    await delay();
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return createResponse({ 
        user: userWithoutPassword, 
        token: 'mock-jwt-token-' + user.id 
      });
    }
    throw new Error('بيانات تسجيل الدخول غير صحيحة');
  },

  getCurrentUser: async () => {
    await delay();
    const userData = localStorage.getItem('user');
    if (userData) {
      return createResponse({ user: JSON.parse(userData) });
    }
    throw new Error('المستخدم غير مسجل الدخول');
  },

  logout: async () => {
    await delay();
    return createResponse(null, 'تم تسجيل الخروج بنجاح');
  }
};

// Users Service
export const usersService = {
  getUsers: async (params = {}) => {
    await delay();
    let users = [...mockUsers];
    
    // Filter by role if specified
    if (params.role) {
      users = users.filter(u => u.role === params.role);
    }
    
    // Search by name or email
    if (params.search) {
      const search = params.search.toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(search) || 
        u.email.toLowerCase().includes(search)
      );
    }
    
    return createResponse(users);
  },

  getUser: async (id) => {
    await delay();
    const user = getUserById(id);
    if (!user) throw new Error('المستخدم غير موجود');
    return createResponse(user);
  },

  getDoctors: async () => {
    await delay();
    const doctors = mockUsers.filter(u => u.role === 'doctor');
    return createResponse(doctors);
  },

  getUserStats: async () => {
    await delay();
    const stats = {
      totalUsers: mockUsers.length,
      doctors: mockUsers.filter(u => u.role === 'doctor').length,
      receptionists: mockUsers.filter(u => u.role === 'receptionist').length,
      admins: mockUsers.filter(u => u.role === 'admin').length
    };
    return createResponse(stats);
  }
};

// Patients Service
export const patientsService = {
  getPatients: async (params = {}) => {
    await delay();
    let patients = [...mockPatients];
    
    // Search by name, email, or phone
    if (params.search) {
      const search = params.search.toLowerCase();
      patients = patients.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.email.toLowerCase().includes(search) ||
        p.phone.includes(search)
      );
    }
    
    // Pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPatients = patients.slice(startIndex, endIndex);
    
    return createResponse({
      patients: paginatedPatients,
      total: patients.length,
      page,
      totalPages: Math.ceil(patients.length / limit)
    });
  },

  getPatient: async (id) => {
    await delay();
    const patient = getPatientById(id);
    if (!patient) throw new Error('المريض غير موجود');
    return createResponse(patient);
  },

  createPatient: async (patientData) => {
    await delay();
    const newPatient = generateMockPatient(patientData);
    mockPatients.push(newPatient);
    return createResponse(newPatient, 'تم إضافة المريض بنجاح');
  },

  updatePatient: async (id, patientData) => {
    await delay();
    const patientIndex = mockPatients.findIndex(p => p.id === parseInt(id));
    if (patientIndex === -1) throw new Error('المريض غير موجود');
    
    mockPatients[patientIndex] = {
      ...mockPatients[patientIndex],
      ...patientData,
      updatedAt: new Date().toISOString()
    };
    
    return createResponse(mockPatients[patientIndex], 'تم تحديث بيانات المريض');
  },

  deletePatient: async (id) => {
    await delay();
    const patientIndex = mockPatients.findIndex(p => p.id === parseInt(id));
    if (patientIndex === -1) throw new Error('المريض غير موجود');
    
    mockPatients.splice(patientIndex, 1);
    return createResponse(null, 'تم حذف المريض');
  },

  searchPatients: async (query) => {
    await delay();
    const search = query.toLowerCase();
    const results = mockPatients.filter(p => 
      p.name.toLowerCase().includes(search) || 
      p.email.toLowerCase().includes(search) ||
      p.phone.includes(search)
    );
    return createResponse(results);
  }
};

// Sessions Service
export const sessionsService = {
  getSessions: async (params = {}) => {
    await delay();
    let sessions = [...mockSessions];
    
    // Filter by patient
    if (params.patientId) {
      sessions = sessions.filter(s => s.patientId === parseInt(params.patientId));
    }
    
    // Filter by doctor
    if (params.doctorId) {
      sessions = sessions.filter(s => s.doctorId === parseInt(params.doctorId));
    }
    
    // Filter by date
    if (params.date) {
      sessions = sessions.filter(s => s.date === params.date);
    }
    
    // Filter by status
    if (params.status) {
      sessions = sessions.filter(s => s.status === params.status);
    }
    
    // Add patient and doctor info
    const enrichedSessions = sessions.map(session => ({
      ...session,
      patient: getPatientById(session.patientId),
      doctor: getDoctorById(session.doctorId)
    }));
    
    return createResponse(enrichedSessions);
  },

  getSession: async (id) => {
    await delay();
    const session = mockSessions.find(s => s.id === parseInt(id));
    if (!session) throw new Error('الجلسة غير موجودة');
    
    const enrichedSession = {
      ...session,
      patient: getPatientById(session.patientId),
      doctor: getDoctorById(session.doctorId)
    };
    
    return createResponse(enrichedSession);
  },

  createSession: async (sessionData) => {
    await delay();
    const newSession = generateMockSession(
      sessionData.patientId,
      sessionData.doctorId,
      sessionData.date,
      sessionData.time
    );
    
    // Add additional data
    Object.assign(newSession, sessionData);
    
    mockSessions.push(newSession);
    return createResponse(newSession, 'تم إنشاء الجلسة بنجاح');
  },

  updateSession: async (id, sessionData) => {
    await delay();
    const sessionIndex = mockSessions.findIndex(s => s.id === parseInt(id));
    if (sessionIndex === -1) throw new Error('الجلسة غير موجودة');
    
    mockSessions[sessionIndex] = {
      ...mockSessions[sessionIndex],
      ...sessionData,
      updatedAt: new Date().toISOString()
    };
    
    return createResponse(mockSessions[sessionIndex], 'تم تحديث الجلسة');
  },

  deleteSession: async (id) => {
    await delay();
    const sessionIndex = mockSessions.findIndex(s => s.id === parseInt(id));
    if (sessionIndex === -1) throw new Error('الجلسة غير موجودة');
    
    mockSessions.splice(sessionIndex, 1);
    return createResponse(null, 'تم حذف الجلسة');
  },

  getTodaySessions: async () => {
    await delay();
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = mockSessions.filter(s => s.date === today);
    
    const enrichedSessions = todaySessions.map(session => ({
      ...session,
      patient: getPatientById(session.patientId),
      doctor: getDoctorById(session.doctorId)
    }));
    
    return createResponse(enrichedSessions);
  }
};

// Payments Service
export const paymentsService = {
  getPayments: async (params = {}) => {
    await delay();
    let payments = [...mockPayments];
    
    // Filter by patient
    if (params.patientId) {
      payments = payments.filter(p => p.patientId === parseInt(params.patientId));
    }
    
    // Filter by status
    if (params.status) {
      payments = payments.filter(p => p.status === params.status);
    }
    
    // Filter by date range
    if (params.startDate && params.endDate) {
      payments = payments.filter(p => 
        p.date >= params.startDate && p.date <= params.endDate
      );
    }
    
    // Add patient and session info
    const enrichedPayments = payments.map(payment => ({
      ...payment,
      patient: getPatientById(payment.patientId),
      session: mockSessions.find(s => s.id === payment.sessionId)
    }));
    
    return createResponse(enrichedPayments);
  },

  getPayment: async (id) => {
    await delay();
    const payment = mockPayments.find(p => p.id === parseInt(id));
    if (!payment) throw new Error('الدفعة غير موجودة');
    
    const enrichedPayment = {
      ...payment,
      patient: getPatientById(payment.patientId),
      session: mockSessions.find(s => s.id === payment.sessionId)
    };
    
    return createResponse(enrichedPayment);
  },

  createPayment: async (paymentData) => {
    await delay();
    const newPayment = generateMockPayment(
      paymentData.sessionId,
      paymentData.patientId,
      paymentData.amount,
      paymentData.method
    );
    
    Object.assign(newPayment, paymentData);
    mockPayments.push(newPayment);
    
    return createResponse(newPayment, 'تم إنشاء الدفعة بنجاح');
  },

  updatePayment: async (id, paymentData) => {
    await delay();
    const paymentIndex = mockPayments.findIndex(p => p.id === parseInt(id));
    if (paymentIndex === -1) throw new Error('الدفعة غير موجودة');
    
    mockPayments[paymentIndex] = {
      ...mockPayments[paymentIndex],
      ...paymentData,
      updatedAt: new Date().toISOString()
    };
    
    return createResponse(mockPayments[paymentIndex], 'تم تحديث الدفعة');
  },

  processPayment: async (id) => {
    await delay();
    const paymentIndex = mockPayments.findIndex(p => p.id === parseInt(id));
    if (paymentIndex === -1) throw new Error('الدفعة غير موجودة');
    
    mockPayments[paymentIndex].status = 'paid';
    mockPayments[paymentIndex].updatedAt = new Date().toISOString();
    
    return createResponse(mockPayments[paymentIndex], 'تم معالجة الدفعة بنجاح');
  },

  getPaymentStats: async (params = {}) => {
    await delay();
    const stats = {
      totalPayments: mockPayments.reduce((sum, p) => sum + p.amount, 0),
      paidPayments: mockPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
      pendingPayments: mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
      totalCount: mockPayments.length,
      paidCount: mockPayments.filter(p => p.status === 'paid').length,
      pendingCount: mockPayments.filter(p => p.status === 'pending').length
    };
    
    return createResponse(stats);
  }
};

// Dashboard Service
export const dashboardService = {
  getOverview: async () => {
    await delay();
    const stats = getDashboardStats();
    return createResponse(stats);
  },

  getTodayAppointments: async () => {
    await delay();
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = mockSessions.filter(s => s.date === today);
    
    const enrichedSessions = todaySessions.map(session => ({
      ...session,
      patient: getPatientById(session.patientId),
      doctor: getDoctorById(session.doctorId)
    }));
    
    return createResponse(enrichedSessions);
  },

  getRecentPatients: async (params = {}) => {
    await delay();
    const limit = parseInt(params.limit) || 5;
    const recentPatients = mockPatients
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
    
    return createResponse(recentPatients);
  },

  getUpcomingAppointments: async (params = {}) => {
    await delay();
    const limit = parseInt(params.limit) || 10;
    const today = new Date().toISOString().split('T')[0];
    
    const upcomingSessions = mockSessions
      .filter(s => s.date >= today && s.status === 'scheduled')
      .sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
      .slice(0, limit);
    
    const enrichedSessions = upcomingSessions.map(session => ({
      ...session,
      patient: getPatientById(session.patientId),
      doctor: getDoctorById(session.doctorId)
    }));
    
    return createResponse(enrichedSessions);
  }
};
