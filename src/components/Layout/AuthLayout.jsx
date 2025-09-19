import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stethoscope, Globe } from 'lucide-react';
import Button from '../UI/Button';

const AuthLayout = ({ children }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language === 'ar' ? 'العربية' : 'English';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold-50 to-gold-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
          className="flex items-center space-x-2 rtl:space-x-reverse text-gold-700 hover:text-gold-800"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm">
            {i18n.language === 'ar' ? 'English' : 'العربية'}
          </span>
        </Button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gold-500 rounded-xl flex items-center justify-center shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {t('common.clinicName', 'نظام إدارة العيادة الطبية')}
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t('common.managementSystem', 'Medical Clinic Management System')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gold-200">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          © 2024 {t('common.clinicName', 'Medical Clinic')}. {t('common.allRightsReserved', 'All rights reserved')}.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
