import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Stethoscope,
  Award,
  Clock,
  Edit,
  Trash2,
  AlertCircle,
  Star,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { usersAPI } from '../../services/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatDate, cn } from '../../utils';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await usersAPI.getUser(id);
      setEmployee(response.data.user);
    } catch (error) {
      console.error('Error fetching employee:', error);
      showError(t('messages.error.general'));
      navigate('/employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!window.confirm(t('employees.confirmDelete'))) {
      return;
    }

    try {
      await usersAPI.deleteUser(id);
      showSuccess(t('employees.employeeDeleted'));
      navigate('/employees');
    } catch (error) {
      console.error('Error deleting employee:', error);
      showError(error.response?.data?.message || t('messages.error.general'));
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'receptionist':
        return 'bg-green-100 text-green-800';
      case 'nurse':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('employees.employeeNotFound')}
        </h3>
        <Button
          onClick={() => navigate('/employees')}
          variant="outline"
        >
          {t('common.goBack')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/employees')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            {t('common.back')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {employee.name}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('employees.employeeDetails')}
            </p>
          </div>
        </div>
        
        {user?.role === 'admin' && (
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Button
              as={Link}
              to={`/employees/${id}/edit`}
              variant="outline"
              icon={<Edit className="w-4 h-4" />}
            >
              {t('common.edit')}
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteEmployee}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
              icon={<Trash2 className="w-4 h-4" />}
            >
              {t('common.delete')}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <User className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('employees.personalInfo')}
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {employee.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                      <span className={cn(
                        "inline-block px-3 py-1 text-sm font-medium rounded-full",
                        getRoleBadgeColor(employee.role)
                      )}>
                        {t(`users.${employee.role}`)}
                      </span>
                      <span className={cn(
                        "inline-block px-3 py-1 text-sm font-medium rounded-full",
                        getStatusBadgeColor(employee.isActive)
                      )}>
                        {employee.isActive ? t('common.active') : t('common.inactive')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('employees.email')}</p>
                        <p className="text-gray-900">{employee.email}</p>
                      </div>
                    </div>

                    {employee.phone && (
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">{t('employees.phone')}</p>
                          <p className="text-gray-900">{employee.phone}</p>
                        </div>
                      </div>
                    )}

                    {employee.specialization && (
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Stethoscope className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">{t('employees.specialization')}</p>
                          <p className="text-gray-900">{employee.specialization}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">{t('employees.joinDate')}</p>
                        <p className="text-gray-900">{formatDate(employee.createdAt)}</p>
                      </div>
                    </div>

                    {employee.department && (
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">{t('employees.department')}</p>
                          <p className="text-gray-900">{employee.department}</p>
                        </div>
                      </div>
                    )}

                    {employee.experience && (
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">{t('employees.experience')}</p>
                          <p className="text-gray-900">{employee.experience} {t('employees.years')}</p>
                        </div>
                      </div>
                    )}

                    {employee.rating && (
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Star className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">{t('employees.rating')}</p>
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <span className="text-gray-900">{employee.rating.toFixed(1)}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-4 h-4",
                                    i < Math.floor(employee.rating)
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

                {employee.bio && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">{t('employees.bio')}</p>
                    <p className="text-gray-700">{employee.bio}</p>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Qualifications */}
          {employee.qualifications && employee.qualifications.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Award className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('employees.qualifications')}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {employee.qualifications.map((qualification, index) => (
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
          {/* Quick Stats */}
          <Card>
            <Card.Header>
              <Card.Title>{t('employees.quickStats')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('employees.totalPatients')}:</span>
                  <span className="font-semibold">{employee.stats?.totalPatients || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('employees.totalSessions')}:</span>
                  <span className="font-semibold">{employee.stats?.totalSessions || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('employees.thisMonth')}:</span>
                  <span className="font-semibold">{employee.stats?.thisMonthSessions || 0}</span>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Availability */}
          {employee.availability && employee.availability.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('employees.availability')}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-2">
                  {employee.availability.map((schedule, index) => (
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
          {employee.languages && employee.languages.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title>{t('employees.languages')}</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="flex flex-wrap gap-2">
                  {employee.languages.map((language, index) => (
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
              <Card.Title>{t('employees.contactInfo')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{employee.phone}</span>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Recent Activity */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <Activity className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('employees.recentActivity')}
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-900">{t('employees.lastLogin')}</p>
                    <p className="text-gray-500">{formatDate(employee.lastLoginAt || employee.updatedAt)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-900">{t('employees.profileUpdated')}</p>
                    <p className="text-gray-500">{formatDate(employee.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
