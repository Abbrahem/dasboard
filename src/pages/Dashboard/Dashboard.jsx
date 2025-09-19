import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  Activity, 
  Clock, 
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatCurrency, formatDate, cn } from '../../utils';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todaySessions: 0,
    thisMonthRevenue: 0,
    myPatients: 0,
    completedSessions: 0,
    inProgressSessions: 0,
    pendingPayments: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [overviewRes, todayRes, recentRes, upcomingRes] = await Promise.all([
        dashboardService.getOverview().catch(err => ({ data: { data: {} } })),
        dashboardService.getTodayAppointments().catch(err => ({ data: { data: [] } })),
        dashboardService.getRecentPatients({ limit: 5 }).catch(err => ({ data: { data: [] } })),
        dashboardService.getUpcomingAppointments({ limit: 5 }).catch(err => ({ data: { data: [] } }))
      ]);

      setStats(overviewRes.data?.data || {});
      setTodayAppointments(todayRes.data?.data || []);
      setRecentPatients(recentRes.data?.data || []);
      setUpcomingAppointments(upcomingRes.data?.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values on error
      setStats({});
      setTodayAppointments([]);
      setRecentPatients([]);
      setUpcomingAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning', 'صباح الخير');
    if (hour < 17) return t('dashboard.goodAfternoon', 'مساء الخير');
    return t('dashboard.goodEvening', 'مساء الخير');
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center mt-2 text-sm",
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            )}>
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-full", color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon: Icon, href, color }) => (
    <Link to={href}>
      <Card className="p-6 hover:shadow-md transition-all hover:scale-105 cursor-pointer">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className={cn("p-3 rounded-full", color)}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <div className="text-gray-400">
            {i18n.language === 'ar' ? (
              <ArrowLeft className="w-5 h-5" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </div>
        </div>
      </Card>
    </Link>
  );

  const AppointmentCard = ({ appointment }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {appointment.patient?.name?.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{appointment.patient?.name}</p>
          <p className="text-sm text-gray-600">
            {appointment.doctor?.name} • {appointment.type}
          </p>
        </div>
      </div>
      <div className="text-right rtl:text-left">
        <p className="text-sm font-medium text-gray-900">
          {appointment.time || 'غير محدد'}
        </p>
        <p className="text-xs text-gray-500">
          {appointment.status}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.name}
          </h1>
          <p className="text-gray-600 mt-1">
            إليك نظرة عامة على مركز العلاج الطبيعي اليوم
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/patients/add">
            <Button
              icon={<Plus className="w-4 h-4" />}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              إضافة مريض جديد
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.role === 'admin' && (
          <>
            <StatCard
              title={t('dashboard.totalPatients')}
              value={stats.totalPatients || 0}
              icon={Users}
              color="bg-blue-500"
              trend="up"
              trendValue="+12%"
            />
            <StatCard
              title={t('dashboard.totalDoctors')}
              value={stats.totalDoctors || 0}
              icon={UserCheck}
              color="bg-green-500"
            />
            <StatCard
              title={t('dashboard.todaySessions')}
              value={stats.todaySessions || 0}
              icon={Calendar}
              color="bg-gold-500"
            />
            <StatCard
              title={t('dashboard.monthlyRevenue')}
              value={formatCurrency(stats.thisMonthRevenue || 0)}
              icon={DollarSign}
              color="bg-purple-500"
              trend="up"
              trendValue="+8%"
            />
          </>
        )}

        {user?.role === 'doctor' && (
          <>
            <StatCard
              title={t('dashboard.myPatients')}
              value={stats.myPatients || 0}
              icon={Users}
              color="bg-blue-500"
            />
            <StatCard
              title={t('dashboard.todaySessions')}
              value={stats.todaySessions || 0}
              icon={Calendar}
              color="bg-gold-500"
            />
            <StatCard
              title={t('dashboard.completedSessions')}
              value={stats.completedSessions || 0}
              icon={Activity}
              color="bg-green-500"
            />
            <StatCard
              title={t('dashboard.inProgressSessions')}
              value={stats.inProgressSessions || 0}
              icon={Clock}
              color="bg-orange-500"
            />
          </>
        )}

        {user?.role === 'receptionist' && (
          <>
            <StatCard
              title={t('dashboard.totalPatients')}
              value={stats.totalPatients || 0}
              icon={Users}
              color="bg-blue-500"
            />
            <StatCard
              title={t('dashboard.todaySessions')}
              value={stats.todaySessions || 0}
              icon={Calendar}
              color="bg-gold-500"
            />
            <StatCard
              title={t('dashboard.pendingPayments')}
              value={stats.pendingPayments || 0}
              icon={Clock}
              color="bg-orange-500"
            />
            <StatCard
              title={t('dashboard.monthlyRevenue')}
              value={formatCurrency(stats.thisMonthRevenue || 0)}
              icon={DollarSign}
              color="bg-purple-500"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('dashboard.quickActions')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(user?.role === 'admin' || user?.role === 'receptionist') && (
            <QuickActionCard
              title={t('dashboard.addPatient')}
              description={t('dashboard.addPatientDesc', 'تسجيل مريض جديد في النظام')}
              icon={Plus}
              href="/patients/add"
              color="bg-blue-500"
            />
          )}
          
          <QuickActionCard
            title={t('dashboard.scheduleAppointment')}
            description={t('dashboard.scheduleAppointmentDesc', 'جدولة موعد جديد')}
            icon={Calendar}
            href="/sessions/add"
            color="bg-green-500"
          />
          
          {(user?.role === 'admin' || user?.role === 'receptionist') && (
            <QuickActionCard
              title={t('dashboard.viewReports')}
              description={t('dashboard.viewReportsDesc', 'عرض التقارير والإحصائيات')}
              icon={Activity}
              href="/reports"
              color="bg-purple-500"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>{t('dashboard.todayAppointments')}</Card.Title>
              <Link
                to="/sessions"
                className="text-sm text-gold-600 hover:text-gold-500 transition-colors"
              >
                {t('common.viewAll')}
              </Link>
            </div>
          </Card.Header>
          <Card.Content>
            {todayAppointments.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.slice(0, 5).map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">{t('dashboard.noAppointments')}</p>
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Recent Patients */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>{t('dashboard.recentPatients')}</Card.Title>
              <Link
                to="/patients"
                className="text-sm text-gold-600 hover:text-gold-500 transition-colors"
              >
                {t('common.viewAll')}
              </Link>
            </div>
          </Card.Header>
          <Card.Content>
            {recentPatients.length > 0 ? (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {patient.name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">
                          {patient.phone} • {patient.gender === 'male' ? 'ذكر' : 'أنثى'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right rtl:text-left">
                      <p className="text-xs text-gray-500">
                        {formatDate(patient.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">{t('dashboard.noPatients')}</p>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
