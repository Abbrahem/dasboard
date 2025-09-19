import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, ArrowLeft, ArrowRight, User, Phone, Mail, UserCheck } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { usersAPI } from '../../services/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { isValidEmail, isValidPhone } from '../../utils';

const AddEmployee = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'receptionist',
    department: 'الاستقبال',
    isActive: true
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = t('validation.required');
    }

    if (!formData.email.trim()) {
      errors.email = t('validation.required');
    } else if (!isValidEmail(formData.email)) {
      errors.email = t('validation.email');
    }

    if (!formData.password) {
      errors.password = t('validation.required');
    } else if (formData.password.length < 6) {
      errors.password = t('validation.passwordLength');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('validation.passwordMatch');
    }

    if (!formData.phone.trim()) {
      errors.phone = t('validation.required');
    } else if (!isValidPhone(formData.phone)) {
      errors.phone = t('validation.phone');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      // Use users API to create employee
      await usersAPI.createUser({
        ...formData,
        role: formData.role || 'receptionist'
      });
      showSuccess(t('employees.addSuccess'));
      navigate('/employees');
    } catch (error) {
      console.error('Error creating employee:', error);
      showError(error.response?.data?.message || t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = i18n.language === 'ar' ? ArrowRight : ArrowLeft;

  const roles = [
    { value: 'receptionist', label: t('employees.receptionist', 'موظف استقبال') },
    { value: 'admin', label: t('employees.admin', 'مدير') }
  ];

  const departments = [
    'الاستقبال',
    'الإدارة',
    'المحاسبة',
    'الموارد البشرية',
    'تقنية المعلومات'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            variant="ghost"
            onClick={() => navigate('/employees')}
            icon={<ArrowIcon className="w-4 h-4" />}
          >
            {t('common.back')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('employees.addEmployee')}
            </h1>
            <p className="text-gray-600">
              {t('employees.addEmployeeDescription', 'إضافة موظف جديد إلى النظام')}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('employees.personalInfo')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={t('employees.name')}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={validationErrors.name}
                required
                icon={<User className="w-5 h-5" />}
              />

              <Input
                label={t('employees.email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={validationErrors.email}
                required
                icon={<Mail className="w-5 h-5" />}
              />

              <Input
                label={t('employees.password')}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={validationErrors.password}
                required
              />

              <Input
                label={t('employees.confirmPassword')}
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={validationErrors.confirmPassword}
                required
              />

              <Input
                label={t('employees.phone')}
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={validationErrors.phone}
                required
                icon={<Phone className="w-5 h-5" />}
              />
            </div>
          </div>

          {/* Work Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('employees.workInfo')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('employees.role')} <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('employees.department')}
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-gold-600 shadow-sm focus:border-gold-500 focus:ring-gold-500"
              />
              <span className="ml-2 rtl:ml-0 rtl:mr-2 text-sm text-gray-700">
                {t('employees.activeEmployee')}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              icon={<Save className="w-4 h-4" />}
              className="medical-gradient text-white"
            >
              {t('employees.saveEmployee')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddEmployee;
