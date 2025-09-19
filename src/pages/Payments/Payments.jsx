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
  CreditCard,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { paymentsService, patientsService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatDate, getStatusColor, formatCurrency, cn } from '../../utils';

const Payments = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [payments, setPayments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchPayments();
    fetchPatients();
  }, [pagination.page, searchTerm, selectedPatient, statusFilter, methodFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        patient: selectedPatient || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        method: methodFilter !== 'all' ? methodFilter : undefined
      };

      const response = await paymentsService.getPayments(params);
      setPayments(response.data?.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data?.data?.length || 0,
        pages: Math.ceil((response.data?.data?.length || 0) / pagination.limit)
      }));
    } catch (error) {
      console.error('Error fetching payments:', error);
      showError(t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientsService.getPatients({ limit: 100 });
      setPatients(response.data?.data?.patients || response.data?.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePatientFilter = (e) => {
    setSelectedPatient(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleMethodFilter = (e) => {
    setMethodFilter(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm(t('payments.confirmDelete'))) {
      return;
    }

    try {
      await paymentsService.updatePayment(paymentId, { status: 'cancelled' });
      showSuccess(t('payments.paymentDeleted'));
      fetchPayments();
    } catch (error) {
      console.error('Error deleting payment:', error);
      showError(t('messages.error.general'));
    }
  };

  const PaymentCard = ({ payment }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const getStatusIcon = (status) => {
      switch (status) {
        case 'completed':
          return <CheckCircle className="w-4 h-4" />;
        case 'pending':
          return <Clock className="w-4 h-4" />;
        case 'failed':
        case 'cancelled':
          return <XCircle className="w-4 h-4" />;
        default:
          return <CreditCard className="w-4 h-4" />;
      }
    };

    const getMethodIcon = (method) => {
      switch (method) {
        case 'cash':
          return '💵';
        case 'card':
          return '💳';
        case 'bank_transfer':
          return '🏦';
        case 'insurance':
          return '🛡️';
        default:
          return '💰';
      }
    };

    return (
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 rtl:space-x-reverse mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-lg">
                    {getMethodIcon(payment.method)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatCurrency(payment.amount)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {payment.patient?.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                  <CreditCard className="w-4 h-4" />
                  <span>{t(`payments.${payment.method}`)}</span>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(payment.createdAt)}</span>
                </div>

                {payment.session && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-600">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {t('payments.sessionPayment')}
                    </span>
                  </div>
                )}

                {payment.description && (
                  <div className="md:col-span-2">
                    <p className="text-gray-700 text-sm">{payment.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse ml-4 rtl:ml-0 rtl:mr-4">
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor(payment.status)
              )}>
                {getStatusIcon(payment.status)}
                <span className="ml-1 rtl:ml-0 rtl:mr-1">
                  {t(`payments.${payment.status}`)}
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
                      to={`/payments/${payment._id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Eye className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                      {t('common.view')}
                    </Link>
                    
                    {(user?.canModifyPayments && user.canModifyPayments()) && (
                      <>
                        <Link
                          to={`/payments/${payment._id}/edit`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Edit className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                          {t('common.edit')}
                        </Link>
                        
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleDeletePayment(payment._id);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                          {t('common.delete')}
                        </button>
                      </>
                    )}
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
    { value: 'completed', label: t('payments.completed') },
    { value: 'pending', label: t('payments.pending') },
    { value: 'failed', label: t('payments.failed') },
    { value: 'cancelled', label: t('payments.cancelled') }
  ];

  const methodOptions = [
    { value: 'all', label: t('common.allMethods') },
    { value: 'cash', label: t('payments.cash') },
    { value: 'card', label: t('payments.card') },
    { value: 'bank_transfer', label: t('payments.bankTransfer') },
    { value: 'insurance', label: t('payments.insurance') }
  ];

  // Calculate totals
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('payments.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('payments.subtitle', 'إدارة ومتابعة المدفوعات')}
          </p>
        </div>
        
        {(user?.canModifyPayments && user.canModifyPayments()) && (
          <div className="mt-4 sm:mt-0">
            <Button
              as={Link}
              to="/payments/add"
              icon={<Plus className="w-4 h-4" />}
              className="medical-gradient text-white"
            >
              {t('payments.addPayment')}
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('payments.totalAmount')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalAmount)}
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
                {t('payments.completed')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(completedAmount)}
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
                {t('payments.pending')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(pendingAmount)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('payments.totalPayments')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.total}
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
            placeholder={t('payments.searchPayments')}
            value={searchTerm}
            onChange={handleSearch}
            icon={<Search className="w-4 h-4" />}
          />

          {/* Patient Filter */}
          <select
            value={selectedPatient}
            onChange={handlePatientFilter}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            <option value="">{t('common.allPatients', 'جميع المرضى')}</option>
            {Array.isArray(patients) && patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
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

          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={handleMethodFilter}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            {methodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Payments List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text={t('common.loading')} />
        </div>
      ) : payments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.isArray(payments) && payments.map((payment) => (
            <PaymentCard key={payment._id} payment={payment} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('payments.noPayments')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('payments.noPaymentsDescription', 'لا توجد مدفوعات مطابقة لمعايير البحث')}
          </p>
          {(user?.canModifyPayments && user.canModifyPayments()) && (
            <Button
              as={Link}
              to="/payments/add"
              icon={<Plus className="w-4 h-4" />}
              className="medical-gradient text-white"
            >
              {t('payments.addPayment')}
            </Button>
          )}
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

export default Payments;
