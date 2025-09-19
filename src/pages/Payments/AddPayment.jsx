import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Save, 
  ArrowLeft, 
  DollarSign, 
  User, 
  CreditCard,
  Calendar,
  FileText
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { paymentsAPI, patientsAPI, sessionsAPI } from '../../services/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const AddPayment = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [patients, setPatients] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [formData, setFormData] = useState({
    patient: '',
    session: '',
    amount: '',
    method: 'cash',
    status: 'pending',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, sessionsRes] = await Promise.all([
        patientsAPI.getPatients(),
        sessionsAPI.getSessions()
      ]);

      setPatients(patientsRes.data.patients);
      setSessions(sessionsRes.data.sessions);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError(t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient) {
      newErrors.patient = t('validation.required');
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = t('validation.invalidAmount');
    }

    if (!formData.method) {
      newErrors.method = t('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount),
        session: formData.session || undefined
      };

      const response = await paymentsAPI.createPayment(paymentData);
      showSuccess(t('payments.paymentCreated'));
      navigate(`/payments/${response.data.payment._id}`);
    } catch (error) {
      console.error('Error creating payment:', error);
      showError(error.response?.data?.message || t('messages.error.general'));
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

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
            {t('payments.addPayment')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('payments.addPaymentSubtitle')}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('payments.paymentDetails')}
                </Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('payments.patient')} *
                    </label>
                    <select
                      value={formData.patient}
                      onChange={(e) => handleInputChange('patient', e.target.value)}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 ${
                        errors.patient ? 'border-red-300' : ''
                      }`}
                      required
                    >
                      <option value="">{t('payments.selectPatient')}</option>
                      {patients.map((patient) => (
                        <option key={patient._id} value={patient._id}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
                    {errors.patient && (
                      <p className="text-red-600 text-sm mt-1">{errors.patient}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('payments.session')} ({t('common.optional')})
                    </label>
                    <select
                      value={formData.session}
                      onChange={(e) => handleInputChange('session', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                    >
                      <option value="">{t('payments.selectSession')}</option>
                      {sessions
                        .filter(session => session.patient._id === formData.patient)
                        .map((session) => (
                          <option key={session._id} value={session._id}>
                            {session.type} - {new Date(session.scheduledDateTime).toLocaleDateString()}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={`${t('payments.amount')} *`}
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    error={errors.amount}
                    required
                    min="0"
                    step="0.01"
                    icon={<DollarSign className="w-5 h-5" />}
                    placeholder="0.00"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('payments.method')} *
                    </label>
                    <select
                      value={formData.method}
                      onChange={(e) => handleInputChange('method', e.target.value)}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 ${
                        errors.method ? 'border-red-300' : ''
                      }`}
                      required
                    >
                      <option value="cash">{t('payments.cash')}</option>
                      <option value="card">{t('payments.card')}</option>
                      <option value="bank_transfer">{t('payments.bankTransfer')}</option>
                      <option value="insurance">{t('payments.insurance')}</option>
                    </select>
                    {errors.method && (
                      <p className="text-red-600 text-sm mt-1">{errors.method}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payments.description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                    placeholder={t('payments.descriptionPlaceholder')}
                  />
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>{t('payments.paymentStatus')}</Card.Title>
              </Card.Header>
              <Card.Content>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payments.status')}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                  >
                    <option value="pending">{t('payments.pending')}</option>
                    <option value="completed">{t('payments.completed')}</option>
                    <option value="failed">{t('payments.failed')}</option>
                  </select>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>{t('payments.paymentMethods')}</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span>{t('payments.cash')}</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>{t('payments.card')}</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>{t('payments.bankTransfer')}</span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>{t('payments.insurance')}</span>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Actions */}
            <Card>
              <Card.Content>
                <div className="space-y-3">
                  <Button
                    type="submit"
                    loading={saving}
                    disabled={saving}
                    className="w-full medical-gradient text-white"
                    icon={<Save className="w-4 h-4" />}
                  >
                    {saving ? t('common.saving') : t('payments.createPayment')}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/payments')}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPayment;
