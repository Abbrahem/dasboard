// Mock data for frontend-only application

// Mock users for authentication
export const mockUsers = [
  {
    id: 1,
    name: 'أحمد محمد',
    email: 'admin@clinic.com',
    password: 'admin123',
    role: 'admin',
    phone: '01234567890',
    avatar: null,
    department: 'الإدارة',
    specialization: 'إدارة العيادات',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'د. سارة أحمد',
    email: 'doctor1@clinic.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '01234567891',
    avatar: null,
    department: 'قسم العلاج الطبيعي العام',
    specialization: 'العلاج الطبيعي للعظام والمفاصل',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'د. محمد علي',
    email: 'doctor2@clinic.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '01234567892',
    avatar: null,
    department: 'قسم علاج الأطفال',
    specialization: 'العلاج الطبيعي للأطفال',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'د. أحمد محمود',
    email: 'doctor3@clinic.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '01234567893',
    avatar: null,
    department: 'قسم العلاج الرياضي',
    specialization: 'العلاج الطبيعي الرياضي',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 5,
    name: 'د. نورا سالم',
    email: 'doctor4@clinic.com',
    password: 'doctor123',
    role: 'doctor',
    phone: '01234567894',
    avatar: null,
    department: 'قسم العلاج العصبي',
    specialization: 'العلاج الطبيعي العصبي',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 6,
    name: 'فاطمة حسن',
    email: 'receptionist@clinic.com',
    password: 'receptionist123',
    role: 'receptionist',
    phone: '01234567895',
    avatar: null,
    department: 'الاستقبال',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Mock patients
export const mockPatients = [
  {
    id: 1,
    name: 'محمد أحمد علي',
    email: 'patient1@example.com',
    phone: '01111111111',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    address: 'القاهرة، مصر الجديدة',
    emergencyContact: {
      name: 'أحمد علي',
      phone: '01111111112',
      relation: 'والد'
    },
    medicalHistory: [
      {
        condition: 'ضغط الدم المرتفع',
        diagnosedDate: '2023-01-15',
        status: 'active'
      }
    ],
    allergies: ['البنسلين'],
    bloodType: 'O+',
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'فاطمة محمد حسن',
    email: 'patient2@example.com',
    phone: '01222222222',
    dateOfBirth: '1985-08-22',
    gender: 'female',
    address: 'الجيزة، المهندسين',
    emergencyContact: {
      name: 'محمد حسن',
      phone: '01222222223',
      relation: 'زوج'
    },
    medicalHistory: [
      {
        condition: 'السكري النوع الثاني',
        diagnosedDate: '2022-06-10',
        status: 'active'
      }
    ],
    allergies: [],
    bloodType: 'A+',
    createdAt: '2024-12-16T09:15:00Z',
    updatedAt: '2024-12-16T09:15:00Z'
  },
  {
    id: 3,
    name: 'أحمد سعد محمود',
    email: 'patient3@example.com',
    phone: '01333333333',
    dateOfBirth: '2010-12-03',
    gender: 'male',
    address: 'القاهرة، مدينة نصر',
    emergencyContact: {
      name: 'سعد محمود',
      phone: '01333333334',
      relation: 'والد'
    },
    medicalHistory: [],
    allergies: ['الفول السوداني'],
    bloodType: 'B+',
    createdAt: '2024-12-17T14:20:00Z',
    updatedAt: '2024-12-17T14:20:00Z'
  },
  {
    id: 4,
    name: 'نورا عبد الرحمن',
    email: 'patient4@example.com',
    phone: '01444444444',
    dateOfBirth: '1995-03-18',
    gender: 'female',
    address: 'الإسكندرية، سموحة',
    emergencyContact: {
      name: 'عبد الرحمن أحمد',
      phone: '01444444445',
      relation: 'والد'
    },
    medicalHistory: [
      {
        condition: 'الربو',
        diagnosedDate: '2020-09-12',
        status: 'active'
      }
    ],
    allergies: ['الغبار', 'حبوب اللقاح'],
    bloodType: 'AB+',
    createdAt: '2024-12-18T11:45:00Z',
    updatedAt: '2024-12-18T11:45:00Z'
  },
  {
    id: 5,
    name: 'خالد محمد عبد الله',
    email: 'patient5@example.com',
    phone: '01555555555',
    dateOfBirth: '1978-11-25',
    gender: 'male',
    address: 'القاهرة، الزمالك',
    emergencyContact: {
      name: 'محمد عبد الله',
      phone: '01555555556',
      relation: 'أخ'
    },
    medicalHistory: [
      {
        condition: 'التهاب المفاصل',
        diagnosedDate: '2021-04-08',
        status: 'active'
      }
    ],
    allergies: [],
    bloodType: 'O-',
    createdAt: '2024-12-19T16:30:00Z',
    updatedAt: '2024-12-19T16:30:00Z'
  }
];

// Mock sessions
export const mockSessions = [
  {
    id: 1,
    patientId: 1,
    doctorId: 2,
    date: '2024-12-20',
    time: '10:00',
    duration: 30,
    type: 'assessment',
    status: 'scheduled',
    notes: 'تقييم أولي لآلام الظهر والرقبة',
    diagnosis: '',
    prescription: '',
    fee: 200,
    scheduledDateTime: '2024-12-20T10:00:00',
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-15T10:30:00Z'
  },
  {
    id: 2,
    patientId: 2,
    doctorId: 2,
    date: '2024-12-19',
    time: '10:30',
    duration: 45,
    type: 'treatment',
    status: 'completed',
    notes: 'جلسة علاج طبيعي للركبة اليمنى',
    diagnosis: 'التهاب مفصل الركبة - تحسن ملحوظ',
    prescription: 'تمارين تقوية عضلات الفخذ - 3 مرات أسبوعياً',
    fee: 250,
    scheduledDateTime: '2024-12-19T10:30:00',
    createdAt: '2024-12-16T09:15:00Z',
    updatedAt: '2024-12-19T10:45:00Z'
  },
  {
    id: 3,
    patientId: 3,
    doctorId: 3,
    date: '2024-12-21',
    time: '14:00',
    duration: 30,
    type: 'exercise',
    status: 'scheduled',
    notes: 'جلسة تمارين علاجية للأطفال',
    diagnosis: '',
    prescription: '',
    fee: 180,
    scheduledDateTime: '2024-12-21T14:00:00',
    createdAt: '2024-12-17T14:20:00Z',
    updatedAt: '2024-12-17T14:20:00Z'
  },
  {
    id: 4,
    patientId: 4,
    doctorId: 2,
    date: '2024-12-22',
    time: '11:00',
    duration: 30,
    type: 'consultation',
    status: 'scheduled',
    notes: 'متابعة حالة الربو',
    diagnosis: '',
    prescription: '',
    fee: 200,
    scheduledDateTime: '2024-12-22T11:00:00',
    createdAt: '2024-12-18T11:45:00Z',
    updatedAt: '2024-12-18T11:45:00Z'
  },
  {
    id: 5,
    patientId: 5,
    doctorId: 2,
    date: '2024-12-18',
    time: '15:30',
    duration: 45,
    type: 'follow-up',
    status: 'completed',
    notes: 'متابعة التهاب المفاصل',
    diagnosis: 'التهاب المفاصل - تحسن ملحوظ',
    prescription: 'إيبوبروفين 400 مجم عند الحاجة',
    fee: 250,
    scheduledDateTime: '2024-12-18T15:30:00',
    createdAt: '2024-12-18T16:30:00Z',
    updatedAt: '2024-12-18T15:45:00Z'
  }
];

// Mock payments
export const mockPayments = [
  {
    id: 1,
    sessionId: 2,
    patientId: 2,
    amount: 250,
    method: 'cash',
    status: 'paid',
    date: '2024-12-19',
    notes: 'دفع نقدي',
    createdAt: '2024-12-19T10:45:00Z',
    updatedAt: '2024-12-19T10:45:00Z'
  },
  {
    id: 2,
    sessionId: 5,
    patientId: 5,
    amount: 250,
    method: 'card',
    status: 'paid',
    date: '2024-12-18',
    notes: 'دفع بالبطاقة الائتمانية',
    createdAt: '2024-12-18T15:45:00Z',
    updatedAt: '2024-12-18T15:45:00Z'
  },
  {
    id: 3,
    sessionId: 1,
    patientId: 1,
    amount: 200,
    method: 'cash',
    status: 'pending',
    date: '2024-12-20',
    notes: 'في انتظار الدفع',
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z'
  },
  {
    id: 4,
    sessionId: 3,
    patientId: 3,
    amount: 180,
    method: 'cash',
    status: 'pending',
    date: '2024-12-21',
    notes: 'في انتظار الدفع',
    createdAt: '2024-12-21T14:00:00Z',
    updatedAt: '2024-12-21T14:00:00Z'
  },
  {
    id: 5,
    sessionId: 4,
    patientId: 4,
    amount: 200,
    method: 'insurance',
    status: 'pending',
    date: '2024-12-22',
    notes: 'دفع عن طريق التأمين',
    createdAt: '2024-12-22T11:00:00Z',
    updatedAt: '2024-12-22T11:00:00Z'
  }
];

// Helper functions to get related data
export const getPatientById = (id) => mockPatients.find(p => p.id === parseInt(id));
export const getDoctorById = (id) => mockUsers.find(u => u.id === parseInt(id) && u.role === 'doctor');
export const getUserById = (id) => mockUsers.find(u => u.id === parseInt(id));

export const getSessionsByPatient = (patientId) => 
  mockSessions.filter(s => s.patientId === parseInt(patientId));

export const getSessionsByDoctor = (doctorId) => 
  mockSessions.filter(s => s.doctorId === parseInt(doctorId));

export const getPaymentsByPatient = (patientId) => 
  mockPayments.filter(p => p.patientId === parseInt(patientId));

export const getPaymentsBySession = (sessionId) => 
  mockPayments.filter(p => p.sessionId === parseInt(sessionId));

// Dashboard stats
export const getDashboardStats = () => ({
  totalPatients: mockPatients.length,
  totalSessions: mockSessions.length,
  totalPayments: mockPayments.reduce((sum, p) => sum + p.amount, 0),
  pendingPayments: mockPayments.filter(p => p.status === 'pending').length,
  todaySessions: mockSessions.filter(s => s.date === new Date().toISOString().split('T')[0]).length,
  completedSessions: mockSessions.filter(s => s.status === 'completed').length
});

// Generate more mock data if needed
export const generateMockSession = (patientId, doctorId, date, time) => ({
  id: Math.max(...mockSessions.map(s => s.id)) + 1,
  patientId: parseInt(patientId),
  doctorId: parseInt(doctorId),
  date,
  time,
  duration: 30,
  type: 'consultation',
  status: 'scheduled',
  notes: '',
  diagnosis: '',
  prescription: '',
  fee: 200,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const generateMockPatient = (patientData) => ({
  id: Math.max(...mockPatients.map(p => p.id)) + 1,
  ...patientData,
  medicalHistory: [],
  allergies: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

export const generateMockPayment = (sessionId, patientId, amount, method = 'cash') => ({
  id: Math.max(...mockPayments.map(p => p.id)) + 1,
  sessionId: parseInt(sessionId),
  patientId: parseInt(patientId),
  amount: parseFloat(amount),
  method,
  status: 'pending',
  date: new Date().toISOString().split('T')[0],
  notes: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});
