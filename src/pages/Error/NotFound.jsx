import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import Button from '../../components/UI/Button';

const NotFound = () => {
  const { t, i18n } = useTranslation();
  
  const ArrowIcon = i18n.language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mx-auto w-24 h-24 bg-gold-100 rounded-full flex items-center justify-center mb-6">
            <Search className="w-12 h-12 text-gold-600" />
          </div>

          {/* Error Code */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>

          {/* Error Message */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {t('error.pageNotFound', 'الصفحة غير موجودة')}
          </h2>
          
          <p className="text-gray-600 mb-8">
            {t('error.pageNotFoundDescription', 'عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها.')}
          </p>

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

          {/* Help Section */}
          <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {t('error.needHelp', 'تحتاج مساعدة؟')}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('error.helpDescription', 'إذا كنت تعتقد أن هذا خطأ، يرجى الاتصال بفريق الدعم.')}
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <strong>{t('common.email')}:</strong> support@medicalclinic.com
              </p>
              <p className="text-gray-600">
                <strong>{t('common.phone')}:</strong> +966 12 345 6789
              </p>
            </div>
          </div>

          {/* Popular Links */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              {t('error.popularPages', 'الصفحات الشائعة')}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                to="/patients"
                className="text-gold-600 hover:text-gold-500 transition-colors"
              >
                {t('navigation.patients')}
              </Link>
              <Link
                to="/doctors"
                className="text-gold-600 hover:text-gold-500 transition-colors"
              >
                {t('navigation.doctors')}
              </Link>
              <Link
                to="/sessions"
                className="text-gold-600 hover:text-gold-500 transition-colors"
              >
                {t('navigation.sessions')}
              </Link>
              <Link
                to="/calendar"
                className="text-gold-600 hover:text-gold-500 transition-colors"
              >
                {t('navigation.calendar')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
