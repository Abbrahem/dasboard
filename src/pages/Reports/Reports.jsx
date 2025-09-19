import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  Download,
  Filter,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { dashboardService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils';

const Reports = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [reportData, setReportData] = useState({
    overview: {},
    patients: {},
    sessions: {},
    payments: {},
    doctors: {}
  });

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getOverview();
      setReportData(response.data?.data || {});
    } catch (error) {
      console.error('Error fetching report data:', error);
      showError(t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      // Mock export functionality
      const data = JSON.stringify(reportData, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${dateRange}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
      showError(t('messages.error.general'));
    }
  };

  const dateRangeOptions = [
    { value: 'week', label: t('reports.thisWeek') },
    { value: 'month', label: t('reports.thisMonth') },
    { value: 'quarter', label: t('reports.thisQuarter') },
    { value: 'year', label: t('reports.thisYear') }
  ];

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
            {t('reports.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('reports.subtitle', 'تقارير شاملة عن أداء العيادة')}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3 rtl:space-x-reverse">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="block rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <Button
            variant="outline"
            onClick={() => exportReport('pdf')}
            icon={<Download className="w-4 h-4" />}
          >
            {t('reports.exportPDF')}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => exportReport('excel')}
            icon={<Download className="w-4 h-4" />}
          >
            {t('reports.exportExcel')}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('reports.totalPatients')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.overview.totalPatients || 0}
              </p>
              <p className="text-sm text-green-600">
                +{reportData.overview.newPatients || 0} {t('reports.new')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('reports.totalSessions')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.overview.totalSessions || 0}
              </p>
              <p className="text-sm text-blue-600">
                {reportData.overview.completedSessions || 0} {t('reports.completed')}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('reports.totalRevenue')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reportData.overview.totalRevenue || 0)}
              </p>
              <p className="text-sm text-green-600">
                +{((reportData.overview.revenueGrowth || 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('reports.avgSessionCost')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reportData.overview.avgSessionCost || 0)}
              </p>
              <p className="text-sm text-gray-600">
                {t('reports.perSession')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patients Report */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <Users className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('reports.patientsReport')}
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('reports.newPatients')}</span>
                <span className="font-semibold">{reportData.patients.newPatients || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('reports.activePatients')}</span>
                <span className="font-semibold">{reportData.patients.activePatients || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('reports.returningPatients')}</span>
                <span className="font-semibold">{reportData.patients.returningPatients || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('reports.avgAge')}</span>
                <span className="font-semibold">{reportData.patients.avgAge || 0} {t('reports.years')}</span>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Sessions Report */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <Activity className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('reports.sessionsReport')}
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('reports.scheduledSessions')}</span>
                <span className="font-semibold">{reportData.sessions.scheduled || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('reports.completedSessions')}</span>
                <span className="font-semibold">{reportData.sessions.completed || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('reports.cancelledSessions')}</span>
                <span className="font-semibold">{reportData.sessions.cancelled || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('reports.avgDuration')}</span>
                <span className="font-semibold">{reportData.sessions.avgDuration || 0} {t('reports.minutes')}</span>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Payments Report */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('reports.paymentsReport')}
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('reports.totalPayments')}</span>
                <span className="font-semibold">{formatCurrency(reportData.payments.total || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('reports.cashPayments')}</span>
                <span className="font-semibold">{formatCurrency(reportData.payments.cash || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('reports.cardPayments')}</span>
                <span className="font-semibold">{formatCurrency(reportData.payments.card || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('reports.pendingPayments')}</span>
                <span className="font-semibold">{formatCurrency(reportData.payments.pending || 0)}</span>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Doctors Performance */}
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('reports.doctorsPerformance')}
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              {(reportData.doctors.performance || []).map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{doctor.sessions || 0} {t('reports.sessions')}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(doctor.revenue || 0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
            {t('reports.monthlyTrends')}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">{t('reports.patientsGrowth')}</p>
              <p className="text-3xl font-bold text-blue-600">
                +{((reportData.overview.patientsGrowth || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">{t('reports.sessionsGrowth')}</p>
              <p className="text-3xl font-bold text-green-600">
                +{((reportData.overview.sessionsGrowth || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">{t('reports.revenueGrowth')}</p>
              <p className="text-3xl font-bold text-yellow-600">
                +{((reportData.overview.revenueGrowth || 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <Card.Title>{t('reports.quickActions')}</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => exportReport('pdf')}
            >
              <FileText className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('reports.detailedReport')}
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => exportReport('excel')}
            >
              <BarChart3 className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('reports.financialReport')}
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={() => exportReport('csv')}
            >
              <PieChart className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t('reports.customReport')}
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Reports;
