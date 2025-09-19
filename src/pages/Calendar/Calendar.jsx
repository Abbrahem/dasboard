import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Stethoscope,
  Filter,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { sessionsService, usersService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatTime, getStatusColor, cn } from '../../utils';

const Calendar = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { showError } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [viewMode, setViewMode] = useState('month'); // month, week, day

  useEffect(() => {
    fetchSessions();
    fetchDoctors();
  }, [currentDate, selectedDoctor, viewMode]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      
      const response = await sessionsService.getSessions({});
      setSessions(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await usersService.getUsers({ role: 'doctor' });
      setDoctors(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  const getViewStartDate = () => {
    const date = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        date.setDate(1);
        date.setDate(date.getDate() - date.getDay());
        break;
      case 'week':
        date.setDate(date.getDate() - date.getDay());
        break;
      case 'day':
        break;
    }
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getViewEndDate = () => {
    const date = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        date.setMonth(date.getMonth() + 1, 0);
        date.setDate(date.getDate() + (6 - date.getDay()));
        break;
      case 'week':
        date.setDate(date.getDate() + 6);
        break;
      case 'day':
        break;
    }
    date.setHours(23, 59, 59, 999);
    return date;
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + direction);
        break;
    }
    setCurrentDate(newDate);
  };

  const getSessionsForDate = (date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.scheduledDateTime);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const renderMonthView = () => {
    const startDate = getViewStartDate();
    const days = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const daysSessions = getSessionsForDate(date);
      const isCurrentMonth = date.getMonth() === currentDate.getMonth();
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <div
          key={i}
          className={cn(
            "min-h-[120px] p-2 border border-gray-200",
            !isCurrentMonth && "bg-gray-50 text-gray-400",
            isToday && "bg-blue-50 border-blue-200"
          )}
        >
          <div className={cn(
            "text-sm font-medium mb-2",
            isToday && "text-blue-600"
          )}>
            {date.getDate()}
          </div>
          
          <div className="space-y-1">
            {daysSessions.slice(0, 3).map((session) => (
              <Link
                key={session._id}
                to={`/sessions/${session._id}`}
                className={cn(
                  "block text-xs p-1 rounded truncate hover:opacity-80 transition-opacity",
                  getStatusColor(session.status, 'bg')
                )}
              >
                <div className="font-medium">{formatTime(session.scheduledDateTime)}</div>
                <div className="truncate">{session.patient?.name}</div>
              </Link>
            ))}
            
            {daysSessions.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{daysSessions.length - 3} {t('calendar.more')}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day) => (
          <div key={day} className="bg-gray-100 p-3 text-center font-medium text-gray-700 border-b border-gray-200">
            {t(`calendar.${day}`)}
          </div>
        ))}
        
        {/* Days */}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startDate = getViewStartDate();
    const days = [];
    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return (
      <div className="grid grid-cols-8 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {/* Time column header */}
        <div className="bg-gray-100 p-3 text-center font-medium text-gray-700 border-b border-gray-200">
          {t('calendar.time')}
        </div>
        
        {/* Day headers */}
        {days.map((day) => (
          <div key={day.toISOString()} className="bg-gray-100 p-3 text-center font-medium text-gray-700 border-b border-gray-200">
            <div>{t(`calendar.${['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][day.getDay()]}`)}</div>
            <div className="text-lg">{day.getDate()}</div>
          </div>
        ))}

        {/* Time slots */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Time label */}
            <div className="p-2 text-sm text-gray-600 border-r border-gray-200 text-center">
              {hour}:00
            </div>
            
            {/* Day columns */}
            {days.map((day) => {
              const daySessions = getSessionsForDate(day).filter(session => {
                const sessionHour = new Date(session.scheduledDateTime).getHours();
                return sessionHour === hour;
              });

              return (
                <div key={`${day.toISOString()}-${hour}`} className="min-h-[60px] p-1 border-r border-b border-gray-200">
                  {daySessions.map((session) => (
                    <Link
                      key={session._id}
                      to={`/sessions/${session._id}`}
                      className={cn(
                        "block text-xs p-1 rounded mb-1 hover:opacity-80 transition-opacity",
                        getStatusColor(session.status, 'bg')
                      )}
                    >
                      <div className="font-medium">{session.patient?.name}</div>
                      <div className="truncate">{session.doctor?.name}</div>
                    </Link>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const daysSessions = getSessionsForDate(currentDate);
    const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            {currentDate.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-0 border border-gray-200 rounded-lg overflow-hidden">
          {hours.map((hour) => {
            const hourSessions = daysSessions.filter(session => {
              const sessionHour = new Date(session.scheduledDateTime).getHours();
              return sessionHour === hour;
            });

            return (
              <div key={hour} className="flex border-b border-gray-200">
                <div className="w-20 p-3 text-sm text-gray-600 border-r border-gray-200 text-center">
                  {hour}:00
                </div>
                <div className="flex-1 min-h-[80px] p-3">
                  <div className="space-y-2">
                    {hourSessions.map((session) => (
                      <Link
                        key={session._id}
                        to={`/sessions/${session._id}`}
                        className={cn(
                          "block p-3 rounded-lg hover:shadow-md transition-shadow",
                          getStatusColor(session.status, 'bg')
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{session.patient?.name}</div>
                            <div className="text-sm text-gray-600">{session.type || t('sessions.consultation')}</div>
                            <div className="text-sm text-gray-600">{session.doctor?.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatTime(session.scheduledDateTime)}</div>
                            <div className="text-xs text-gray-500">{session.duration} {t('sessions.minutes')}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case 'month':
        return currentDate.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
          year: 'numeric',
          month: 'long'
        });
      case 'week':
        const startDate = getViewStartDate();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
      case 'day':
        return currentDate.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('calendar.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('calendar.subtitle', 'عرض وإدارة مواعيد الجلسات')}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button
            as={Link}
            to="/sessions/add"
            icon={<Plus className="w-4 h-4" />}
            className="medical-gradient text-white"
          >
            {t('sessions.addSession')}
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Navigation */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate(-1)}
              icon={i18n.language === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            >
              {t('calendar.previous')}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              {t('calendar.today')}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate(1)}
              icon={i18n.language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            >
              {t('calendar.next')}
            </Button>

            <h2 className="text-lg font-semibold text-gray-900">
              {getViewTitle()}
            </h2>
          </div>

          {/* View Mode & Filters */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Doctor Filter */}
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="block rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 text-sm"
            >
              <option value="">{t('common.allDoctors')}</option>
              {Array.isArray(doctors) && doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex rounded-md border border-gray-300 overflow-hidden">
              {[
                { value: 'month', label: t('calendar.month') },
                { value: 'week', label: t('calendar.week') },
                { value: 'day', label: t('calendar.day') }
              ].map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setViewMode(mode.value)}
                  className={cn(
                    "px-3 py-1 text-sm font-medium transition-colors",
                    viewMode === mode.value
                      ? "bg-gold-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Calendar View */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text={t('common.loading')} />
        </div>
      ) : (
        <Card className="p-6">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </Card>
      )}

      {/* Legend */}
      <Card className="p-4">
        <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse text-sm">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <span>{t('sessions.scheduled')}</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
            <span>{t('sessions.inProgress')}</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span>{t('sessions.completed')}</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 bg-red-200 rounded"></div>
            <span>{t('sessions.cancelled')}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calendar;
