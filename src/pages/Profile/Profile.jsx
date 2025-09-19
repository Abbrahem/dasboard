import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Stethoscope,
  Award,
  Clock,
  Users,
  Activity,
  Edit,
  Settings,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { formatDate, cn } from '../../utils';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: t('profile.overview'), icon: User },
    { id: 'activity', label: t('profile.activity'), icon: Activity },
    { id: 'performance', label: t('profile.performance'), icon: Star }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Information */}
      <div className="lg:col-span-2">
        <Card>
          <Card.Header>
            <Card.Title>{t('profile.personalInfo')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-lg text-blue-600">{user?.specialization || user?.role}</p>
                  {user?.department && (
                    <p className="text-gray-600">{user.department}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('profile.email')}</p>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('profile.phone')}</p>
                      <p className="text-gray-900">{user?.phone}</p>
                    </div>
                  </div>

                  {user?.role === 'doctor' && user?.experience && (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Stethoscope className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('profile.experience')}</p>
                        <p className="text-gray-900">{user.experience} {t('profile.years')}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('profile.joinDate')}</p>
                      <p className="text-gray-900">{formatDate(user?.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">{t('profile.role')}</p>
                      <p className="text-gray-900">{user?.roleArabic || user?.role}</p>
                    </div>
                  </div>

                  {user?.rating && (
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Star className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('profile.rating')}</p>
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <span className="text-gray-900">{user.rating.toFixed(1)}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-4 h-4",
                                  i < Math.floor(user.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {user?.bio && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">{t('profile.bio')}</p>
                  <p className="text-gray-700">{user.bio}</p>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Qualifications */}
        {user?.qualifications && user.qualifications.length > 0 && (
          <Card className="mt-6">
            <Card.Header>
              <Card.Title className="flex items-center">
                <Award className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('profile.qualifications')}
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {user.qualifications.map((qualification, index) => (
                  <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse p-4 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 text-gold-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{qualification.degree}</h4>
                      <p className="text-sm text-gray-600">{qualification.institution}</p>
                      {qualification.year && (
                        <p className="text-sm text-gray-500">{qualification.year}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <Card.Title>{t('profile.quickActions')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              <Link
                to="/settings"
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Edit className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                {t('profile.editProfile')}
              </Link>

              <Link
                to="/settings"
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Settings className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                {t('profile.accountSettings')}
              </Link>
            </div>
          </Card.Content>
        </Card>

        {/* Availability */}
        {user?.availability && user.availability.length > 0 && (
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <Clock className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('profile.availability')}
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-2">
                {user.availability.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-900">
                      {t(`days.${schedule.day}`)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Languages */}
        {user?.languages && user.languages.length > 0 && (
          <Card>
            <Card.Header>
              <Card.Title>{t('profile.languages')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-wrap gap-2">
                {user.languages.map((language, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Contact Info */}
        <Card>
          <Card.Header>
            <Card.Title>{t('profile.contactInfo')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user?.email}</span>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{user?.phone}</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title>{t('profile.recentActivity')}</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{t('profile.loginActivity')}</p>
                <p className="text-xs text-gray-500">{t('profile.today')} 09:30 AM</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{t('profile.profileUpdated')}</p>
                <p className="text-xs text-gray-500">{t('profile.yesterday')} 02:15 PM</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{t('profile.passwordChanged')}</p>
                <p className="text-xs text-gray-500">3 {t('profile.daysAgo')}</p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );

  const renderPerformance = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4 rtl:ml-0 rtl:mr-4">
            <p className="text-sm font-medium text-gray-600">
              {t('profile.totalPatients')}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {user?.stats?.totalPatients || 0}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <Activity className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4 rtl:ml-0 rtl:mr-4">
            <p className="text-sm font-medium text-gray-600">
              {t('profile.totalSessions')}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {user?.stats?.totalSessions || 0}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-4 rtl:ml-0 rtl:mr-4">
            <p className="text-sm font-medium text-gray-600">
              {t('profile.avgRating')}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {user?.rating ? user.rating.toFixed(1) : '0.0'}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4 rtl:ml-0 rtl:mr-4">
            <p className="text-sm font-medium text-gray-600">
              {t('profile.thisMonth')}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {user?.stats?.thisMonthSessions || 0}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('profile.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('profile.subtitle', 'معلومات ملفك الشخصي')}
          </p>
        </div>
        
        <Button
          as={Link}
          to="/settings"
          variant="outline"
          icon={<Edit className="w-4 h-4" />}
        >
          {t('profile.editProfile')}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 rtl:space-x-reverse">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 rtl:space-x-reverse py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-gold-500 text-gold-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'activity' && renderActivity()}
        {activeTab === 'performance' && renderPerformance()}
      </div>
    </div>
  );
};

export default Profile;
