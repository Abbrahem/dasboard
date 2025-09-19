import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  ArrowRight, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope,
  DollarSign,
  FileText,
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Heart,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { sessionsAPI } from '../../services/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatDateTime, getStatusColor, formatCurrency, cn } from '../../utils';

const SessionDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchSessionData();
    }
  }, [id]);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      const response = await sessionsAPI.getSession(id);
      setSession(response.data.session);
    } catch (error) {
      console.error('Error fetching session:', error);
      showError(t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    try {
      await sessionsAPI.startSession(id);
      showSuccess(t('sessions.sessionStarted'));
      fetchSessionData();
    } catch (error) {
      console.error('Error starting session:', error);
      showError(t('messages.error.general'));
    }
  };

  const handleCompleteSession = async () => {
    try {
      await sessionsAPI.completeSession(id, {});
      showSuccess(t('sessions.sessionCompleted'));
      fetchSessionData();
    } catch (error) {
      console.error('Error completing session:', error);
      showError(t('messages.error.general'));
    }
  };

  const handleCancelSession = async () => {
    const reason = window.prompt(t('sessions.cancelReason'));
    if (!reason) return;

    try {
      await sessionsAPI.cancelSession(id, reason);
      showSuccess(t('sessions.sessionCancelled'));
      fetchSessionData();
    } catch (error) {
      console.error('Error cancelling session:', error);
      showError(t('messages.error.general'));
    }
  };

  const handleDeleteSession = async () => {
    if (!window.confirm(t('sessions.confirmDelete'))) {
      return;
    }

    try {
      await sessionsAPI.deleteSession(id);
      showSuccess(t('sessions.sessionDeleted'));
      navigate('/sessions');
    } catch (error) {
      console.error('Error deleting session:', error);
      showError(t('messages.error.general'));
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

  if (!session) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('sessions.sessionNotFound')}
        </h3>
        <Button
          as={Link}
          to="/sessions"
          variant="outline"
          icon={<ArrowIcon className="w-4 h-4" />}
        >
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-5 h-5" />;
      case 'in-progress':
        return <Play className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
      case 'no-show':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'normal':
        return 'text-blue-600 bg-blue-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const canStartSession = session.status === 'scheduled' && 
                         (user?.role === 'doctor' || user?.role === 'admin');
  const canCompleteSession = session.status === 'in-progress' && 
                            (user?.role === 'doctor' || user?.role === 'admin');
  const canCancelSession = ['scheduled', 'in-progress'].includes(session.status) && 
                          (user?.role === 'doctor' || user?.role === 'admin' || user?.role === 'receptionist');
  const canEditSession = ['scheduled'].includes(session.status) && 
                        (user?.role === 'doctor' || user?.role === 'admin' || user?.role === 'receptionist');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            variant="ghost"
            onClick={() => navigate('/sessions')}
            icon={<ArrowIcon className="w-4 h-4" />}
          >
            {t('common.back')}
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('sessions.sessionDetails')}
            </h1>
            <p className="text-gray-600">
              {session.type || t('sessions.generalConsultation')} • {formatDateTime(session.scheduledDateTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* Status Badge */}
          <span className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
            getStatusColor(session.status)
          )}>
            {getStatusIcon(session.status)}
            <span className="ml-2 rtl:ml-0 rtl:mr-2">
              {t(`sessions.${session.status}`)}
            </span>
          </span>

          {/* Action Buttons */}
          <div className="flex space-x-2 rtl:space-x-reverse">
            {canStartSession && (
              <Button
                onClick={handleStartSession}
                variant="success"
                size="sm"
                icon={<Play className="w-4 h-4" />}
              >
                {t('sessions.startSession')}
              </Button>
            )}

            {canCompleteSession && (
              <Button
                onClick={handleCompleteSession}
                variant="primary"
                size="sm"
                icon={<CheckCircle className="w-4 h-4" />}
              >
                {t('sessions.completeSession')}
              </Button>
            )}

            {canEditSession && (
              <Button
                as={Link}
                to={`/sessions/${session._id}/edit`}
                variant="outline"
                size="sm"
                icon={<Edit className="w-4 h-4" />}
              >
                {t('common.edit')}
              </Button>
            )}

            {canCancelSession && (
              <Button
                onClick={handleCancelSession}
                variant="warning"
                size="sm"
                icon={<XCircle className="w-4 h-4" />}
              >
                {t('sessions.cancel')}
              </Button>
            )}

            <Button
              onClick={handleDeleteSession}
              variant="danger"
              size="sm"
              icon={<Trash2 className="w-4 h-4" />}
            >
              {t('common.delete')}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <Card.Header>
              <Card.Title>{t('sessions.basicInfo')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t('sessions.patient')}
                    </label>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mt-1">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {session.patient?.name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{session.patient?.name}</p>
                        <p className="text-sm text-gray-600">{session.patient?.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t('sessions.type')}
                    </label>
                    <p className="text-gray-900 mt-1">
                      {session.type ? t(`sessions.${session.type}`) : t('sessions.generalConsultation')}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t('sessions.priority')}
                    </label>
                    <span className={cn(
                      "inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1",
                      getPriorityColor(session.priority)
                    )}>
                      {t(`sessions.${session.priority}Priority`)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t('sessions.doctor')}
                    </label>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse mt-1">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {session.doctor?.name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{session.doctor?.name}</p>
                        <p className="text-sm text-gray-600">{session.doctor?.specialization}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t('sessions.scheduledDateTime')}
                    </label>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{formatDateTime(session.scheduledDateTime)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t('sessions.duration')}
                    </label>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{session.duration} {t('sessions.minutes')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Medical Information */}
          {(session.diagnosis || session.treatment || session.prescription) && (
            <Card>
              <Card.Header>
                <Card.Title>{t('sessions.medicalInfo')}</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {session.diagnosis && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center">
                        <Stethoscope className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                        {t('sessions.diagnosis')}
                      </label>
                      <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                        {session.diagnosis}
                      </p>
                    </div>
                  )}

                  {session.treatment && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 flex items-center">
                        <Heart className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                        {t('sessions.treatment')}
                      </label>
                      <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                        {session.treatment}
                      </p>
                    </div>
                  )}

                  {session.prescription && session.prescription.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        {t('sessions.prescription')}
                      </label>
                      <div className="mt-1 space-y-2">
                        {session.prescription.map((med, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-lg">
                            <p className="font-medium text-blue-900">{med.medication}</p>
                            <p className="text-sm text-blue-700">
                              {med.dosage} • {med.frequency} • {med.duration}
                            </p>
                            {med.instructions && (
                              <p className="text-sm text-blue-600 mt-1">{med.instructions}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Vitals */}
          {session.vitals && Object.keys(session.vitals).length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title>{t('sessions.vitals')}</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {session.vitals.bloodPressure && (
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-medium text-red-700">{t('sessions.bloodPressure')}</p>
                      <p className="text-lg font-bold text-red-900">{session.vitals.bloodPressure}</p>
                    </div>
                  )}
                  
                  {session.vitals.heartRate && (
                    <div className="text-center p-3 bg-pink-50 rounded-lg">
                      <p className="text-sm font-medium text-pink-700">{t('sessions.heartRate')}</p>
                      <p className="text-lg font-bold text-pink-900">{session.vitals.heartRate} bpm</p>
                    </div>
                  )}
                  
                  {session.vitals.temperature && (
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium text-orange-700">{t('sessions.temperature')}</p>
                      <p className="text-lg font-bold text-orange-900">{session.vitals.temperature}°C</p>
                    </div>
                  )}
                  
                  {session.vitals.weight && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-700">{t('sessions.weight')}</p>
                      <p className="text-lg font-bold text-blue-900">{session.vitals.weight} kg</p>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Notes */}
          {session.notes && (
            <Card>
              <Card.Header>
                <Card.Title>{t('sessions.notes')}</Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-700 whitespace-pre-wrap">{session.notes}</p>
              </Card.Content>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cost Information */}
          {session.cost && (
            <Card>
              <Card.Header>
                <Card.Title>{t('sessions.costInfo')}</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(session.cost)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {t('sessions.sessionCost')}
                  </p>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Session Timeline */}
          <Card>
            <Card.Header>
              <Card.Title>{t('sessions.timeline')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {t('sessions.sessionCreated')}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDateTime(session.createdAt)}
                    </p>
                  </div>
                </div>

                {session.startedAt && (
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {t('sessions.sessionStarted')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDateTime(session.startedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {session.completedAt && (
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {t('sessions.sessionCompleted')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDateTime(session.completedAt)}
                      </p>
                    </div>
                  </div>
                )}

                {session.cancelledAt && (
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {t('sessions.sessionCancelled')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatDateTime(session.cancelledAt)}
                      </p>
                      {session.cancellationReason && (
                        <p className="text-xs text-red-600 mt-1">
                          {session.cancellationReason}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Quick Actions */}
          <Card>
            <Card.Header>
              <Card.Title>{t('sessions.quickActions')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-2">
                <Link
                  to={`/patients/${session.patient?._id}`}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <User className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                  {t('sessions.viewPatient')}
                </Link>

                <Link
                  to={`/doctors/${session.doctor?._id}`}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Stethoscope className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                  {t('sessions.viewDoctor')}
                </Link>

                {session.cost && (
                  <Link
                    to={`/payments/add?session=${session._id}`}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <DollarSign className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                    {t('sessions.createPayment')}
                  </Link>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;
