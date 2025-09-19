import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  DollarSign, 
  Calendar, 
  User, 
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { paymentsAPI } from '../../services/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatCurrency, formatDateTime, getStatusColor, cn } from '../../utils';

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const fetchPayment = async () => {
    try {
      const response = await paymentsAPI.getPayment(id);
      setPayment(response.data.payment);
    } catch (error) {
      console.error('Error fetching payment:', error);
      showError(t('messages.error.general'));
      navigate('/payments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'card':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'bank_transfer':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'insurance':
        return <FileText className="w-5 h-5 text-indigo-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('payments.paymentNotFound')}
        </h3>
        <Button
          onClick={() => navigate('/payments')}
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
            onClick={() => navigate('/payments')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            {t('common.back')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('payments.paymentDetails')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('payments.paymentId')}: {payment._id}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Information */}
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('payments.paymentInfo')}
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      {t('payments.amount')}
                    </label>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      {t('payments.method')}
                    </label>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {getMethodIcon(payment.method)}
                      <span className="text-gray-900 capitalize">
                        {t(`payments.${payment.method}`)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      {t('payments.status')}
                    </label>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {getStatusIcon(payment.status)}
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        getStatusColor(payment.status, 'bg')
                      )}>
                        {t(`payments.${payment.status}`)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      {t('payments.createdAt')}
                    </label>
                    <p className="text-gray-900">
                      {formatDateTime(payment.createdAt)}
                    </p>
                  </div>

                  {payment.paidAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        {t('payments.paidAt')}
                      </label>
                      <p className="text-gray-900">
                        {formatDateTime(payment.paidAt)}
                      </p>
                    </div>
                  )}

                  {payment.description && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        {t('payments.description')}
                      </label>
                      <p className="text-gray-900">
                        {payment.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Patient Information */}
          {payment.patient && (
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <User className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('payments.patientInfo')}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {payment.patient.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {payment.patient.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      {payment.patient.phone}
                    </p>
                  </div>
                  <Button
                    as={Link}
                    to={`/patients/${payment.patient._id}`}
                    variant="outline"
                    size="sm"
                  >
                    {t('common.viewDetails')}
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )}

          {/* Session Information */}
          {payment.session && (
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('payments.sessionInfo')}
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {payment.session.type || t('sessions.consultation')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(payment.session.scheduledDateTime)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('sessions.doctor')}: {payment.session.doctor?.name}
                    </p>
                  </div>
                  <Button
                    as={Link}
                    to={`/sessions/${payment.session._id}`}
                    variant="outline"
                    size="sm"
                  >
                    {t('common.viewDetails')}
                  </Button>
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
              <Card.Title>{t('common.actions')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {payment.status === 'pending' && (
                  <Button
                    className="w-full medical-gradient text-white"
                    size="sm"
                  >
                    {t('payments.markAsPaid')}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {t('payments.printReceipt')}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {t('payments.sendReceipt')}
                </Button>
              </div>
            </Card.Content>
          </Card>

          {/* Payment Summary */}
          <Card>
            <Card.Header>
              <Card.Title>{t('payments.summary')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('payments.subtotal')}:</span>
                  <span className="font-medium">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('payments.tax')}:</span>
                  <span className="font-medium">{formatCurrency(0)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium">{t('payments.total')}:</span>
                    <span className="font-bold text-lg">{formatCurrency(payment.amount)}</span>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Payment History */}
          <Card>
            <Card.Header>
              <Card.Title>{t('payments.history')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {t('payments.paymentCreated')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(payment.createdAt)}
                    </p>
                  </div>
                </div>

                {payment.paidAt && (
                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {t('payments.paymentCompleted')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(payment.paidAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
