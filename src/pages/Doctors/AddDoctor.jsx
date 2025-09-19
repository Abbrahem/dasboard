import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, ArrowLeft, ArrowRight, User, Phone, Mail, Stethoscope } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { usersService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { isValidEmail, isValidPhone } from '../../utils';

const AddDoctor = () => {
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
    dateOfBirth: '',
    gender: 'male',
    role: 'doctor',
    specialization: '',
    department: 'الطب العام',
    experience: '1'
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
      errors.name = 'الاسم مطلوب';
    }

    if (!formData.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.password) {
      errors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      errors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'كلمة المرور غير متطابقة';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'رقم الهاتف مطلوب';
    } else if (!isValidPhone(formData.phone)) {
      errors.phone = 'رقم الهاتف غير صحيح';
    }

    if (!formData.specialization.trim()) {
      errors.specialization = 'التخصص مطلوب';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Use users service to create doctor
      await usersService.createUser({
        ...formData,
        role: 'doctor',
        createdAt: new Date().toISOString()
      });
      showSuccess('تم إضافة الطبيب بنجاح');
      navigate('/doctors');
    } catch (error) {
      console.error('Error creating doctor:', error);
      showError('حدث خطأ أثناء إضافة الطبيب');
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = i18n.language === 'ar' ? ArrowRight : ArrowLeft;

  const specializations = [
    'العلاج الطبيعي العام',
    'العلاج الطبيعي للعظام والمفاصل',
    'العلاج الطبيعي العصبي',
    'العلاج الطبيعي للأطفال',
    'العلاج الطبيعي الرياضي',
    'العلاج الطبيعي للمسنين',
    'العلاج الطبيعي للنساء',
    'العلاج الطبيعي التنفسي',
    'العلاج الطبيعي القلبي',
    'إعادة التأهيل الطبي'
  ];

  const departments = [
    'العيادة العامة',
    'قسم القلب',
    'قسم الأطفال',
    'قسم النساء والولادة',
    'قسم الجراحة',
    'قسم العيون',
    'قسم الأنف والأذن',
    'قسم الأسنان',
    'قسم الطب النفسي',
    'قسم العلاج الطبيعي'
  ];

  const days = [
    { value: 'sunday', label: 'الأحد' },
    { value: 'monday', label: 'الإثنين' },
    { value: 'tuesday', label: 'الثلاثاء' },
    { value: 'wednesday', label: 'الأربعاء' },
    { value: 'thursday', label: 'الخميس' },
    { value: 'friday', label: 'الجمعة' },
    { value: 'saturday', label: 'السبت' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            إضافة دكتور جديد
          </h1>
          <p className="text-gray-600 mt-1">
            إضافة طبيب جديد إلى النظام
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/doctors')}
          className="flex items-center"
        >
          <ArrowIcon className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          رجوع
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              البيانات الأساسية
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="الاسم الكامل"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={validationErrors.name}
                required
                icon={<User className="w-5 h-5" />}
              />

              <Input
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={validationErrors.email}
                required
                icon={<Mail className="w-5 h-5" />}
              />

              <Input
                label="كلمة المرور"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={validationErrors.password}
                required
              />

              <Input
                label="تأكيد كلمة المرور"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={validationErrors.confirmPassword}
                required
              />

              <Input
                label="رقم الهاتف"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={validationErrors.phone}
                required
                icon={<Phone className="w-5 h-5" />}
              />

              <Input
                label="تاريخ الميلاد"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الجنس
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  التخصص <span className="text-red-500">*</span>
                </label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                >
                  <option value="">اختر التخصص</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                {validationErrors.specialization && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.specialization}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  القسم
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                >
                  <option value="قسم العلاج الطبيعي العام">قسم العلاج الطبيعي العام</option>
                  <option value="قسم العظام والمفاصل">قسم العظام والمفاصل</option>
                  <option value="قسم العلاج العصبي">قسم العلاج العصبي</option>
                  <option value="قسم علاج الأطفال">قسم علاج الأطفال</option>
                  <option value="قسم العلاج الرياضي">قسم العلاج الرياضي</option>
                  <option value="قسم إعادة التأهيل">قسم إعادة التأهيل</option>
                  <option value="قسم العلاج التنفسي">قسم العلاج التنفسي</option>
                  <option value="قسم العلاج القلبي">قسم العلاج القلبي</option>
                </select>
              </div>

              <Input
                label="سنوات الخبرة"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="عدد سنوات الخبرة"
                min="1"
                max="50"
              />
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 rtl:space-x-reverse">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/doctors')}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="bg-gold-600 hover:bg-gold-700 text-white"
          >
            <Save className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            حفظ
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
