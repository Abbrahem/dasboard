import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';

// Layout Components
import Layout from './components/Layout/Layout';
import AuthLayout from './components/Layout/AuthLayout';
import ErrorBoundary from './components/ErrorBoundary';

// Auth Pages
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Dashboard Pages
import Dashboard from './pages/Dashboard/Dashboard';

// Patient Pages
import Patients from './pages/Patients/Patients';
import PatientDetails from './pages/Patients/PatientDetails';
import AddPatient from './pages/Patients/AddPatient';
import EditPatient from './pages/Patients/EditPatient';

// Doctor Pages
import Doctors from './pages/Doctors/Doctors';
import DoctorDetails from './pages/Doctors/DoctorDetails';
import AddDoctor from './pages/Doctors/AddDoctor';
import EditDoctor from './pages/Doctors/EditDoctor';

// Session Pages
import Sessions from './pages/Sessions/Sessions';
import SessionDetails from './pages/Sessions/SessionDetails';
import AddSession from './pages/Sessions/AddSession';
import EditSession from './pages/Sessions/EditSession';

// Payment Pages
import Payments from './pages/Payments/Payments';
import PaymentDetails from './pages/Payments/PaymentDetails';
import AddPayment from './pages/Payments/AddPayment';

// Employee Pages
import Employees from './pages/Employees/Employees';
import EmployeeDetails from './pages/Employees/EmployeeDetails';
import AddEmployee from './pages/Employees/AddEmployee';

// Settings Pages
import Settings from './pages/Settings/Settings';
import Profile from './pages/Profile/Profile';

// Calendar Page
import Calendar from './pages/Calendar/Calendar';

// Reports Pages
import Reports from './pages/Reports/Reports';

// Error Pages
import NotFound from './pages/Error/NotFound';
import Unauthorized from './pages/Error/Unauthorized';

// Loading Component
import LoadingSpinner from './components/UI/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  const { i18n } = useTranslation();

  // Set document direction based on language
  React.useEffect(() => {
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        } />
        
        <Route path="/forgot-password" element={
          <PublicRoute>
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Patients */}
          <Route path="patients" element={
            <ProtectedRoute roles={['admin', 'doctor', 'receptionist']}>
              <Patients />
            </ProtectedRoute>
          } />
          <Route path="patients/add" element={
            <ProtectedRoute roles={['admin', 'receptionist']}>
              <AddPatient />
            </ProtectedRoute>
          } />
          <Route path="patients/:id" element={
            <ProtectedRoute roles={['admin', 'doctor', 'receptionist']}>
              <PatientDetails />
            </ProtectedRoute>
          } />
          <Route path="patients/:id/edit" element={
            <ProtectedRoute roles={['admin', 'receptionist']}>
              <EditPatient />
            </ProtectedRoute>
          } />

          {/* Doctors */}
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/add" element={
            <ProtectedRoute roles={['admin']}>
              <AddDoctor />
            </ProtectedRoute>
          } />
          <Route path="doctors/:id/edit" element={
            <ProtectedRoute roles={['admin']}>
              <EditDoctor />
            </ProtectedRoute>
          } />
          <Route path="doctors/:id" element={<DoctorDetails />} />

          {/* Sessions */}
          <Route path="sessions" element={
            <ProtectedRoute roles={['admin', 'doctor', 'receptionist']}>
              <Sessions />
            </ProtectedRoute>
          } />
          <Route path="sessions/add" element={
            <ProtectedRoute roles={['admin', 'receptionist']}>
              <AddSession />
            </ProtectedRoute>
          } />
          <Route path="sessions/:id" element={
            <ProtectedRoute roles={['admin', 'doctor', 'receptionist']}>
              <SessionDetails />
            </ProtectedRoute>
          } />
          <Route path="sessions/:id/edit" element={
            <ProtectedRoute roles={['admin', 'doctor', 'receptionist']}>
              <EditSession />
            </ProtectedRoute>
          } />

          {/* Payments */}
          <Route path="payments" element={
            <ProtectedRoute roles={['admin', 'receptionist']}>
              <Payments />
            </ProtectedRoute>
          } />
          <Route path="payments/add" element={
            <ProtectedRoute roles={['admin', 'receptionist']}>
              <AddPayment />
            </ProtectedRoute>
          } />
          <Route path="payments/:id" element={
            <ProtectedRoute roles={['admin', 'receptionist']}>
              <PaymentDetails />
            </ProtectedRoute>
          } />

          {/* Employees */}
          <Route path="employees" element={
            <ProtectedRoute roles={['admin', 'receptionist']}>
              <Employees />
            </ProtectedRoute>
          } />
          <Route path="employees/add" element={
            <ProtectedRoute roles={['admin']}>
              <AddEmployee />
            </ProtectedRoute>
          } />
          <Route path="employees/:id" element={
            <ProtectedRoute roles={['admin', 'receptionist']}>
              <EmployeeDetails />
            </ProtectedRoute>
          } />

          {/* Calendar */}
          <Route path="calendar" element={<Calendar />} />

          {/* Reports */}
          <Route path="reports" element={
            <ProtectedRoute roles={['admin', 'receptionist']}>
              <Reports />
            </ProtectedRoute>
          } />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
