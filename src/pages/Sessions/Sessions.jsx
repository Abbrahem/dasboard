import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Play,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { sessionsService, usersService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatDateTime, getStatusColor, formatCurrency, cn } from '../../utils';

const Sessions = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [sessions, setSessions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchSessions();
    fetchDoctors();
  }, [pagination.page, searchTerm, selectedDoctor, statusFilter, dateFilter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        doctor: selectedDoctor || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        date: dateFilter !== 'all' ? dateFilter : undefined
      };

      const response = await sessionsService.getSessions(params);
      setSessions(response.data?.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data?.data?.length || 0,
        pages: Math.ceil((response.data?.data?.length || 0) / pagination.limit)
      }));
    } catch (error) {
      console.error('Error fetching sessions:', error);
      showError(t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await usersService.getDoctors();
      setDoctors(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDoctorFilter = (e) => {
    setSelectedDoctor(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDateFilter = (e) => {
    setDateFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStartSession = async (sessionId) => {
    try {
      await sessionsService.updateSession(sessionId, { status: 'in-progress' });
      showSuccess(t('sessions.sessionStarted'));
      fetchSessions();
    } catch (error) {
      console.error('Error starting session:', error);
      showError(t('messages.error.general'));
    }
  };

  const handleCompleteSession = async (sessionId) => {
    try {
      await sessionsService.updateSession(sessionId, { status: 'completed' });
      showSuccess(t('sessions.sessionCompleted'));
      fetchSessions();
    } catch (error) {
      console.error('Error completing session:', error);
      showError(t('messages.error.general'));
    }
  };

  const handleCancelSession = async (sessionId) => {
    const reason = window.prompt(t('sessions.cancelReason'));
    if (!reason) return;

    try {
      await sessionsService.updateSession(sessionId, { status: 'cancelled', notes: reason });
      showSuccess(t('sessions.sessionCancelled'));
      fetchSessions();
    } catch (error) {
      console.error('Error cancelling session:', error);
      showError(t('messages.error.general'));
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm(t('sessions.confirmDelete'))) {
      return;
    }

    try {
      await sessionsService.deleteSession(sessionId);
      showSuccess(t('sessions.sessionDeleted'));
      fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      showError(t('messages.error.general'));
    }
  };


  const SessionCard = ({ session }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const getStatusIcon = (status) => {
      switch (status) {
        case 'scheduled':
          return <Clock className="w-4 h-4" />;
        case 'in-progress':
          return <Play className="w-4 h-4" />;
        case 'completed':
          return <CheckCircle className="w-4 h-4" />;
        case 'cancelled':
        case 'no-show':
          return <XCircle className="w-4 h-4" />;
        default:
          return <Calendar className="w-4 h-4" />;
      }
    };

    const canStartSession = session.status === 'scheduled' && 
                           (user?.role === 'doctor' || user?.role === 'admin');
    const canCompleteSession = session.status === 'in-progress' && 
                              (user?.role === 'doctor' || user?.role === 'admin');
    const canCancelSession = ['scheduled', 'in-progress'].includes(session.status) && 
                            (user?.role === 'doctor' || user?.role === 'admin' || user?.role === 'receptionist');

    return (
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 rtl:space-x-reverse mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {session.patient?.name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {session.patient?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {session.type || t('sessions.generalConsultation')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                  <Stethoscope className="w-4 h-4" />
                  <span>{session.doctor?.name}</span>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{session.scheduledDate ? formatDateTime(session.scheduledDate) : 'غير محدد'}</span>
                </div>

                {session.duration && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{session.duration} {t('sessions.minutes')}</span>
                  </div>
                )}

                {session.cost && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                    <span className="font-medium">{formatCurrency(session.cost.totalAmount || session.cost)}</span>
                  </div>
                )}
              </div>

              {(session.diagnosis?.primary || session.diagnosis) && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">
                    <strong>{t('sessions.diagnosis')}:</strong> {typeof session.diagnosis === 'string' ? session.diagnosis : session.diagnosis?.primary || 'غير محدد'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse ml-4 rtl:ml-0 rtl:mr-4">
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor(session.status)
              )}>
                {getStatusIcon(session.status)}
                <span className="ml-1 rtl:ml-0 rtl:mr-1">
                  {t(`sessions.${session.status}`)}
                </span>
              </span>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>

                {dropdownOpen && (
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                    <Link
                      to={`/sessions/${session.id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Eye className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                      عرض التفاصيل
                    </Link>

                    {canStartSession && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleStartSession(session.id);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                      >
                        <Play className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                        بدء الجلسة
                      </button>
                    )}

                    {canCompleteSession && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleCompleteSession(session.id);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                        إنهاء الجلسة
                      </button>
                    )}
                    
                    <Link
                      to={`/sessions/${session.id}/edit`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Edit className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                      {t('common.edit')}
                    </Link>

                    {canCancelSession && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleCancelSession(session._id);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-orange-700 hover:bg-orange-50"
                      >
                        <XCircle className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                        {t('sessions.cancelSession')}
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleDeleteSession(session._id);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                      {t('common.delete')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const statusOptions = [
    { value: 'all', label: t('common.all') },
    { value: 'scheduled', label: t('sessions.scheduled') },
    { value: 'in-progress', label: t('sessions.inProgress') },
    { value: 'completed', label: t('sessions.completed') },
    { value: 'cancelled', label: t('sessions.cancelled') },
    { value: 'no-show', label: t('sessions.noShow') }
  ];

  const dateOptions = [
    { value: 'all', label: t('common.allDates') },
    { value: 'today', label: t('common.today') },
    { value: 'tomorrow', label: t('common.tomorrow') },
    { value: 'this-week', label: t('common.thisWeek') },
    { value: 'next-week', label: t('common.nextWeek') },
    { value: 'this-month', label: t('common.thisMonth') }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('sessions.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('sessions.subtitle', 'إدارة ومتابعة الجلسات الطبية')}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Link to="/sessions/add">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              إضافة جلسة جديدة
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('sessions.totalSessions')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.total}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('sessions.scheduled')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(sessions) ? sessions.filter(s => s.status === 'scheduled').length : 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('sessions.completed')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(sessions) ? sessions.filter(s => s.status === 'completed').length : 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <Play className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('sessions.inProgress')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(sessions) ? sessions.filter(s => s.status === 'in-progress').length : 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <Input
            placeholder={t('sessions.searchSessions')}
            value={searchTerm}
            onChange={handleSearch}
            icon={<Search className="w-4 h-4" />}
          />

          {/* Doctor Filter */}
          <select
            value={selectedDoctor}
            onChange={handleDoctorFilter}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            <option value="">{t('common.allDoctors', 'جميع الأطباء')}</option>
            {Array.isArray(doctors) && doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={handleDateFilter}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Sessions List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text={t('common.loading')} />
        </div>
      ) : sessions.length > 0 ? (
        <div className="space-y-4">
          {Array.isArray(sessions) && sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('sessions.noSessions')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('sessions.noSessionsDescription', 'لا توجد جلسات مطابقة لمعايير البحث')}
          </p>
          <Link to="/sessions/add">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              إضافة جلسة جديدة
            </Button>
          </Link>
        </Card>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {t('common.showing')} {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} {t('common.of')} {pagination.total}
          </div>
          
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              {t('common.previous')}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.pages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;
