import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  ArrowRight, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Stethoscope, 
  Users,
  Activity,
  Clock,
  Star,
  Award,
  BookOpen,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { usersService, sessionsService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatDate, formatDateTime, getStatusColor, cn } from '../../utils';

const DoctorDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useToast();

  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchDoctorData();
    }
  }, [id]);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      
      const [doctorRes, patientsRes, sessionsRes, statsRes] = await Promise.all([
        doctorsAPI.getDoctor(id),
        doctorsAPI.getDoctorPatients(id, { limit: 10 }),
        doctorsAPI.getDoctorSchedule(id, { limit: 10 }),
        doctorsAPI.getDoctorStats(id)
      ]);

      setDoctor(doctorRes.data.doctor);
      setPatients(patientsRes.data.patients);
      setSessions(sessRes.data.sessions);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      showError(t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = i18n.language === 'ar' ? ArrowRight : ArrowLeft;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('doctors.doctorNotFound')}
        </h3>
        <Button
          as={Link}
          to="/doctors"
          variant="outline"
          icon={<ArrowIcon className="w-4 h-4" />}
        >
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: t('doctors.overview'), icon: Stethoscope },
    { id: 'patients', label: t('doctors.patients'), icon: Users },
    { id: 'schedule', label: t('doctors.schedule'), icon: Calendar },
    { id: 'performance', label: t('doctors.performance'), icon: Activity }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Information */}
      <div className="lg:col-span-2">
        <Card>
          <Card.Header>
            <Card.Title>{t('doctors.personalInfo')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('doctors.name')}
                  </label>
                  <p className="text-lg font-semibold text-gray-900">{doctor.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('doctors.specialization')}
                  </label>
                  <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                </div>
                
                {doctor.department && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t('doctors.department')}
                    </label>
                    <p className="text-gray-900">{doctor.department}</p>
                  </div>
                )}
                
                {doctor.experience && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t('doctors.experience')}
                    </label>
                    <p className="text-gray-900">
                      {doctor.experience} {t('doctors.years')}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('doctors.phone')}
                  </label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{doctor.phone}</p>
                  </div>
                </div>
                
                {doctor.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t('doctors.email')}
                    </label>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{doctor.email}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('doctors.joinDate')}
                  </label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{formatDate(doctor.createdAt)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('doctors.status')}
                  </label>
                  <span className={cn(
                    "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                    getStatusColor(doctor.isActive ? 'active' : 'inactive')
                  )}>
                    {doctor.isActive ? t('doctors.active') : t('doctors.inactive')}
                  </span>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Qualifications */}
        {doctor.qualifications && doctor.qualifications.length > 0 && (
          <Card className="mt-6">
            <Card.Header>
              <Card.Title>{t('doctors.qualifications')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {doctor.qualifications.map((qualification, index) => (
                  <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                    <Award className="w-5 h-5 text-gold-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{qualification.degree}</p>
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

        {/* Bio */}
        {doctor.bio && (
          <Card className="mt-6">
            <Card.Header>
              <Card.Title>{t('doctors.bio')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-700 whitespace-pre-wrap">{doctor.bio}</p>
            </Card.Content>
          </Card>
        )}
      </div>

      {/* Stats & Availability */}
      <div className="space-y-6">
        {/* Stats */}
        <Card>
          <Card.Header>
            <Card.Title>{t('doctors.statistics')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">{t('doctors.totalPatients')}</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.totalPatients || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">{t('doctors.totalSessions')}</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.totalSessions || 0}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600">{t('doctors.thisMonth')}</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.thisMonthSessions || 0}</span>
              </div>

              {doctor.rating && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{t('doctors.rating')}</span>
                  </div>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <span className="font-semibold text-gray-900">{doctor.rating.toFixed(1)}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3",
                            i < Math.floor(doctor.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Availability */}
        {doctor.availability && doctor.availability.length > 0 && (
          <Card>
            <Card.Header>
              <Card.Title>{t('doctors.availability')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {doctor.availability.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">
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
        {doctor.languages && doctor.languages.length > 0 && (
          <Card>
            <Card.Header>
              <Card.Title>{t('doctors.languages')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((language, index) => (
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
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {t('doctors.assignedPatients')} ({patients.length})
        </h3>
      </div>

      {patients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patients.map((patient) => (
            <Card key={patient._id} className="hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {patient.name?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">
                      {patient.phone} • {patient.age} {t('patients.years')}
                    </p>
                  </div>
                  <Link
                    to={`/patients/${patient._id}`}
                    className="text-gold-600 hover:text-gold-500"
                  >
                    <ArrowIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('doctors.noPatients')}
          </h3>
          <p className="text-gray-600">
            {t('doctors.noPatientsDescription')}
          </p>
        </div>
      )}
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {t('doctors.upcomingSessions')}
        </h3>
        <Button
          as={Link}
          to={`/sessions/add?doctor=${doctor._id}`}
          icon={<Plus className="w-4 h-4" />}
          size="sm"
          className="medical-gradient text-white"
        >
          {t('sessions.addSession')}
        </Button>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session._id} className="hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div>
                        <p className="font-medium text-gray-900">
                          {session.patient?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.type || t('sessions.generalConsultation')} • {formatDateTime(session.scheduledDateTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <span className={cn(
                    "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                    getStatusColor(session.status)
                  )}>
                    {t(`sessions.${session.status}`)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('doctors.noSessions')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('doctors.noSessionsDescription')}
          </p>
          <Button
            as={Link}
            to={`/sessions/add?doctor=${doctor._id}`}
            icon={<Plus className="w-4 h-4" />}
            className="medical-gradient text-white"
          >
            {t('sessions.addSession')}
          </Button>
        </div>
      )}
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        {t('doctors.performanceMetrics')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('doctors.totalPatients')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalPatients || 0}
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
                {t('doctors.completedSessions')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completedSessions || 0}
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
                {t('doctors.avgRating')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {doctor.rating ? doctor.rating.toFixed(1) : '0.0'}
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
                {t('doctors.thisMonth')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.thisMonthSessions || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            variant="ghost"
            onClick={() => navigate('/doctors')}
            icon={<ArrowIcon className="w-4 h-4" />}
          >
            {t('common.back')}
          </Button>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xl font-medium text-white">
                {doctor.name?.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-blue-600 font-medium">{doctor.specialization}</p>
              {doctor.department && (
                <p className="text-gray-600">{doctor.department}</p>
              )}
            </div>
          </div>
        </div>
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
        {activeTab === 'patients' && renderPatients()}
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'performance' && renderPerformance()}
      </div>
    </div>
  );
};

export default DoctorDetails;
