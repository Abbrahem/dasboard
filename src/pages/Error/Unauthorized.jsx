import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Home, ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';

const Unauthorized = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  
  const ArrowIcon = i18n.language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Unauthorized Illustration */}
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-red-600" />
          </div>

          {/* Error Code */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>

          {/* Error Message */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {t('error.unauthorized', 'غير مخول للوصول')}
          </h2>
          
          <p className="text-gray-600 mb-8">
            {t('error.unauthorizedDescription', 'عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة.')}
          </p>

          {/* User Info */}
          {user && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <Lock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  {t('error.currentRole', 'دورك الحالي')}: <strong>{user.roleArabic || user.role}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link to="/dashboard">
              <Button
                icon={<Home className="w-4 h-4" />}
                className="medical-gradient text-white w-full sm:w-auto"
              >
                {t('error.goHome', 'العودة للرئيسية')}
              </Button>
            </Link>

            <div className="text-center">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center text-sm text-gold-600 hover:text-gold-500 transition-colors"
              >
                <ArrowIcon className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                {t('error.goBack', 'العودة للصفحة السابقة')}
              </button>
            </div>
          </div>

          {/* Permission Info */}
          <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {t('error.needAccess', 'تحتاج صلاحية وصول؟')}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('error.accessDescription', 'إذا كنت تعتقد أنك بحاجة للوصول إلى هذه الصفحة، يرجى الاتصال بمدير النظام.')}
            </p>
            
            <div className="space-y-3">
              <div className="text-sm">
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('error.contactAdmin', 'اتصل بمدير النظام:')}
                </h4>
                <div className="space-y-1 text-gray-600">
                  <p><strong>{t('common.email')}:</strong> admin@medicalclinic.com</p>
                  <p><strong>{t('common.phone')}:</strong> +966 12 345 6789</p>
                </div>
              </div>

              <div className="text-sm">
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('error.includeInfo', 'يرجى تضمين المعلومات التالية:')}
                </h4>
                <ul className="text-gray-600 space-y-1 text-right rtl:text-right list-disc list-inside">
                  <li>{t('error.yourName', 'اسمك')}: {user?.name}</li>
                  <li>{t('error.yourRole', 'دورك')}: {user?.roleArabic || user?.role}</li>
                  <li>{t('error.requestedPage', 'الصفحة المطلوبة')}: {window.location.pathname}</li>
                  <li>{t('error.businessReason', 'سبب الحاجة للوصول')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Available Pages */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              {t('error.availablePages', 'الصفحات المتاحة لك')}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                to="/dashboard"
                className="text-gold-600 hover:text-gold-500 transition-colors"
              >
                {t('navigation.dashboard')}
              </Link>
              
              {user?.canViewPatients() && (
                <Link
                  to="/patients"
                  className="text-gold-600 hover:text-gold-500 transition-colors"
                >
                  {t('navigation.patients')}
                </Link>
              )}
              
              <Link
                to="/doctors"
                className="text-gold-600 hover:text-gold-500 transition-colors"
              >
                {t('navigation.doctors')}
              </Link>
              
              <Link
                to="/calendar"
                className="text-gold-600 hover:text-gold-500 transition-colors"
              >
                {t('navigation.calendar')}
              </Link>
              
              <Link
                to="/profile"
                className="text-gold-600 hover:text-gold-500 transition-colors"
              >
                {t('navigation.profile')}
              </Link>
              
              <Link
                to="/settings"
                className="text-gold-600 hover:text-gold-500 transition-colors"
              >
                {t('navigation.settings')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
