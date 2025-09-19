import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { isValidEmail } from '../../utils';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();
  const { showError, showSuccess } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Clear error when component mounts
  useEffect(() => {
    if (clearError) {
      clearError();
    }
  }, []);

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = t('validation.required');
    } else if (!isValidEmail(formData.email)) {
      errors.email = t('validation.email');
    }

    if (!formData.password) {
      errors.password = t('validation.required');
    } else if (formData.password.length < 6) {
      errors.password = t('validation.minLength', { min: 6 });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      showSuccess(t('auth.loginSuccess'));
      
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          {t('auth.login')}
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          {t('auth.loginSubtitle', 'أدخل بياناتك للوصول إلى حسابك')}
        </p>
        
        {/* Test Credentials */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">بيانات تسجيل الدخول التجريبية:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div><strong>المدير:</strong> admin@clinic.com / admin123</div>
            <div><strong>الطبيب:</strong> doctor1@clinic.com / doctor123</div>
            <div><strong>موظف الاستقبال:</strong> receptionist@clinic.com / receptionist123</div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <Input
          label={t('auth.email')}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          error={validationErrors.email}
          required
          icon={<Mail className="w-5 h-5" />}
          placeholder={t('auth.email')}
          disabled={loading}
        />

        {/* Password */}
        <Input
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          error={validationErrors.password}
          required
          icon={<Lock className="w-5 h-5" />}
          placeholder={t('auth.password')}
          disabled={loading}
        />

        {/* Show/Hide Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center text-sm text-gold-600 hover:text-gold-500 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
              ) : (
                <Eye className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
              )}
              {showPassword ? t('common.hide') : t('common.show')}
            </button>
          </div>

          <Link
            to="/forgot-password"
            className="text-sm text-gold-600 hover:text-gold-500 transition-colors"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-gray-300 rounded"
            disabled={loading}
          />
          <label htmlFor="remember-me" className="ml-2 rtl:ml-0 rtl:mr-2 block text-sm text-gray-900">
            {t('auth.rememberMe')}
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={loading}
          className="medical-gradient text-white font-semibold py-3"
        >
          {t('auth.login')}
        </Button>
      </form>

      {/* Demo Accounts */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          {t('common.demoAccounts', 'Demo Accounts')}:
        </h3>
        <div className="space-y-2 text-xs text-gray-600">
          <div>
            <strong>{t('employees.admin')}:</strong> admin@clinic.com / admin123
          </div>
          <div>
            <strong>{t('employees.doctor')}:</strong> doctor1@clinic.com / doctor123
          </div>
          <div>
            <strong>{t('employees.receptionist')}:</strong> receptionist@clinic.com / receptionist123
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          {t('auth.needHelp', 'Need help?')}{' '}
          <Link
            to="/contact"
            className="font-medium text-gold-600 hover:text-gold-500 transition-colors"
          >
            {t('common.contactSupport', 'Contact Support')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
