import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { isValidEmail } from '../../utils';

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const { showError, showSuccess } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  const validateForm = () => {
    if (!email) {
      setValidationError(t('validation.required'));
      return false;
    }
    
    if (!isValidEmail(email)) {
      setValidationError(t('validation.email'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSent(true);
      showSuccess(t('auth.resetLinkSent', 'Password reset link sent to your email'));
    } catch (error) {
      showError(t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = i18n.language === 'ar' ? ArrowRight : ArrowLeft;

  if (sent) {
    return (
      <div className="text-center space-y-6">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-green-600" />
        </div>

        {/* Success Message */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('auth.checkEmail', 'Check your email')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.resetLinkSentDescription', 'We sent a password reset link to')}
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {email}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            {t('auth.resetInstructions', 'Click the link in the email to reset your password. If you don\'t see the email, check your spam folder.')}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => {
              setSent(false);
              setEmail('');
            }}
            variant="outline"
            fullWidth
          >
            {t('auth.sendAgain', 'Send again')}
          </Button>

          <Link to="/login">
            <Button variant="ghost" fullWidth>
              <ArrowIcon className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('auth.backToLogin', 'Back to login')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          {t('auth.forgotPassword')}
        </h2>
        <p className="mt-2 text-sm text-gray-600 text-center">
          {t('auth.forgotPasswordDescription', 'Enter your email address and we\'ll send you a link to reset your password')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <Input
          label={t('auth.email')}
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          error={validationError}
          required
          icon={<Mail className="w-5 h-5" />}
          placeholder={t('auth.enterEmail', 'Enter your email address')}
          disabled={loading}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={loading || !email}
          className="medical-gradient text-white font-semibold py-3"
        >
          {t('auth.sendResetLink', 'Send reset link')}
        </Button>
      </form>

      {/* Back to Login */}
      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-gold-600 hover:text-gold-500 transition-colors"
        >
          <ArrowIcon className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
          {t('auth.backToLogin', 'Back to login')}
        </Link>
      </div>

      {/* Help */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          {t('auth.needHelp', 'Need help?')}
        </h3>
        <p className="text-sm text-gray-600">
          {t('auth.forgotPasswordHelp', 'If you\'re having trouble accessing your account, contact your system administrator or IT support.')}
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
