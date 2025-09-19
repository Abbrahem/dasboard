import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { user, updateProfile, changePassword } = useAuth();
  const { theme, toggleTheme, sidebarCollapsed, toggleSidebar } = useTheme();
  const { showError, showSuccess } = useToast();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialization: user?.specialization || '',
    department: user?.department || ''
  });

  // Password Settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    paymentAlerts: true,
    systemUpdates: false
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    language: i18n.language,
    theme: theme,
    sidebarCollapsed: sidebarCollapsed,
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'SAR'
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        specialization: user.specialization || '',
        department: user.department || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(profileData);
      showSuccess(t('settings.profileUpdated'));
    } catch (error) {
      console.error('Error updating profile:', error);
      showError(error.response?.data?.message || t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError(t('settings.passwordMismatch'));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError(t('settings.passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      showSuccess(t('settings.passwordChanged'));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      showError(error.response?.data?.message || t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setSystemSettings(prev => ({ ...prev, language }));
    showSuccess(t('settings.languageChanged'));
  };

  const handleThemeChange = () => {
    toggleTheme();
    setSystemSettings(prev => ({ ...prev, theme: theme === 'light' ? 'dark' : 'light' }));
  };

  const tabs = [
    { id: 'profile', label: t('settings.profile'), icon: User },
    { id: 'security', label: t('settings.security'), icon: Shield },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'system', label: t('settings.system'), icon: SettingsIcon }
  ];

  const renderProfileTab = () => (
    <form onSubmit={handleProfileSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t('settings.fullName')}
          value={profileData.name}
          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
          required
          icon={<User className="w-5 h-5" />}
        />

        <Input
          label={t('settings.email')}
          type="email"
          value={profileData.email}
          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
          required
          disabled
          helperText={t('settings.emailCannotChange')}
        />

        <Input
          label={t('settings.phone')}
          value={profileData.phone}
          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
          required
        />

        {user?.role === 'doctor' && (
          <>
            <Input
              label={t('settings.specialization')}
              value={profileData.specialization}
              onChange={(e) => setProfileData(prev => ({ ...prev, specialization: e.target.value }))}
            />

            <Input
              label={t('settings.department')}
              value={profileData.department}
              onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
            />
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          icon={<Save className="w-4 h-4" />}
          className="medical-gradient text-white"
        >
          {t('settings.saveChanges')}
        </Button>
      </div>
    </form>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">
          {t('settings.changePassword')}
        </h3>

        <div className="space-y-4">
          <div className="relative">
            <Input
              label={t('settings.currentPassword')}
              type={showCurrentPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              required
            />
            <button
              type="button"
              className="absolute right-3 rtl:right-auto rtl:left-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label={t('settings.newPassword')}
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              required
              helperText={t('settings.passwordRequirements')}
            />
            <button
              type="button"
              className="absolute right-3 rtl:right-auto rtl:left-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <Input
              label={t('settings.confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
            <button
              type="button"
              className="absolute right-3 rtl:right-auto rtl:left-3 top-8 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            icon={<Save className="w-4 h-4" />}
            className="medical-gradient text-white"
          >
            {t('settings.changePassword')}
          </Button>
        </div>
      </form>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('settings.accountSecurity')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{t('settings.twoFactorAuth')}</p>
              <p className="text-sm text-gray-600">{t('settings.twoFactorDescription')}</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              {t('settings.enable')}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{t('settings.loginHistory')}</p>
              <p className="text-sm text-gray-600">{t('settings.loginHistoryDescription')}</p>
            </div>
            <Button variant="outline" size="sm" disabled>
              {t('settings.view')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        {t('settings.notificationPreferences')}
      </h3>

      <div className="space-y-4">
        {Object.entries(notificationSettings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{t(`settings.${key}`)}</p>
              <p className="text-sm text-gray-600">{t(`settings.${key}Description`)}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setNotificationSettings(prev => ({ 
                  ...prev, 
                  [key]: e.target.checked 
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => showSuccess(t('settings.notificationsSaved'))}
          icon={<Save className="w-4 h-4" />}
          className="medical-gradient text-white"
        >
          {t('settings.saveChanges')}
        </Button>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('settings.appearance')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Globe className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{t('settings.language')}</p>
                <p className="text-sm text-gray-600">{t('settings.languageDescription')}</p>
              </div>
            </div>
            <select
              value={systemSettings.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="block rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <Palette className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{t('settings.theme')}</p>
                <p className="text-sm text-gray-600">{t('settings.themeDescription')}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleThemeChange}
            >
              {theme === 'light' ? t('settings.darkMode') : t('settings.lightMode')}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{t('settings.sidebarCollapsed')}</p>
              <p className="text-sm text-gray-600">{t('settings.sidebarDescription')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sidebarCollapsed}
                onChange={toggleSidebar}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('settings.regional')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('settings.dateFormat')}
            </label>
            <select
              value={systemSettings.dateFormat}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('settings.timeFormat')}
            </label>
            <select
              value={systemSettings.timeFormat}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, timeFormat: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            >
              <option value="24h">24 {t('settings.hour')}</option>
              <option value="12h">12 {t('settings.hour')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('settings.currency')}
            </label>
            <select
              value={systemSettings.currency}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, currency: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
            >
              <option value="SAR">SAR - {t('settings.saudiRiyal')}</option>
              <option value="USD">USD - {t('settings.usDollar')}</option>
              <option value="EUR">EUR - {t('settings.euro')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => showSuccess(t('settings.systemSettingsSaved'))}
          icon={<Save className="w-4 h-4" />}
          className="medical-gradient text-white"
        >
          {t('settings.saveChanges')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('settings.title')}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('settings.subtitle', 'إدارة إعدادات حسابك والنظام')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gold-100 text-gold-700 border-r-2 border-gold-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 rtl:mr-0 rtl:ml-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'system' && renderSystemTab()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
