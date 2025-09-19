import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Save, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { sessionsService, patientsService, usersService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatDateTime } from '../../utils';

const EditSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    scheduledDateTime: '',
    type: 'consultation',
    status: 'scheduled',
    duration: 30,
    cost: 0,
    priority: 'normal',
    notes: '',
    diagnosis: '',
    treatment: '',
    prescription: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSessionData();
    fetchPatients();
    fetchDoctors();
  }, [id]);

  const fetchSessionData = async () => {
    try {
      const response = await sessionsService.getSession(id);
      const sessionData = response.data?.data;
      
      setSession(sessionData);
      setFormData({
        patient: sessionData.patient._id,
        doctor: sessionData.doctor._id,
        scheduledDateTime: new Date(sessionData.scheduledDateTime).toISOString().slice(0, 16),
        type: sessionData.type || 'consultation',
        status: sessionData.status || 'scheduled',
        duration: sessionData.duration || 30,
        cost: sessionData.cost || 0,
        priority: sessionData.priority || 'normal',
        notes: sessionData.notes || '',
        diagnosis: sessionData.diagnosis || '',
        treatment: sessionData.treatment || '',
        prescription: sessionData.prescription || []
      });
    } catch (error) {
      console.error('Error fetching session:', error);
      showError(t('messages.error.general'));
      navigate('/sessions');
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientsService.getPatients();
      setPatients(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await usersService.getUsers({ role: 'doctor' });
      setDoctors(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.patient) {
      newErrors.patient = t('validation.required');
    }

    if (!formData.doctor) {
      newErrors.doctor = t('validation.required');
    }

    if (!formData.scheduledDateTime) {
      newErrors.scheduledDateTime = t('validation.required');
    }

    if (formData.duration < 15) {
      newErrors.duration = t('validation.minDuration');
    }

    if (formData.cost < 0) {
      newErrors.cost = t('validation.minCost');
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
      const updateData = {
        ...formData,
        scheduledDateTime: new Date(formData.scheduledDateTime).toISOString()
      };

      await sessionsService.updateSession(id, updateData);
      showSuccess(t('sessions.sessionUpdated'));
      navigate(`/sessions/${id}`);
    } catch (error) {
      console.error('Error updating session:', error);
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

  if (!session) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('sessions.sessionNotFound')}
        </h3>
        <Button
          onClick={() => navigate('/sessions')}
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
            onClick={() => navigate('/sessions')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            {t('common.back')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('sessions.editSession')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('sessions.editSessionSubtitle')}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <Card.Header>
                <Card.Title className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t('sessions.sessionDetails')}
                </Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('sessions.patient')} *
                    </label>
                    <select
                      value={formData.patient}
                      onChange={(e) => handleInputChange('patient', e.target.value)}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 ${
                        errors.patient ? 'border-red-300' : ''
                      }`}
                      required
                    >
                      <option value="">{t('sessions.selectPatient')}</option>
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
                      {t('sessions.doctor')} *
                    </label>
                    <select
                      value={formData.doctor}
                      onChange={(e) => handleInputChange('doctor', e.target.value)}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 ${
                        errors.doctor ? 'border-red-300' : ''
                      }`}
                      required
                    >
                      <option value="">{t('sessions.selectDoctor')}</option>
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.name} - {doctor.specialization}
                        </option>
                      ))}
                    </select>
                    {errors.doctor && (
                      <p className="text-red-600 text-sm mt-1">{errors.doctor}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={`${t('sessions.dateTime')} *`}
                    type="datetime-local"
                    value={formData.scheduledDateTime}
                    onChange={(e) => handleInputChange('scheduledDateTime', e.target.value)}
                    error={errors.scheduledDateTime}
                    required
                    icon={<Calendar className="w-5 h-5" />}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('sessions.type')}
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                    >
                      <option value="consultation">{t('sessions.consultation')}</option>
                      <option value="follow-up">{t('sessions.followUp')}</option>
                      <option value="emergency">{t('sessions.emergency')}</option>
                      <option value="checkup">{t('sessions.checkup')}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label={t('sessions.duration')}
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    error={errors.duration}
                    min="15"
                    step="15"
                    icon={<Clock className="w-5 h-5" />}
                    helperText={t('sessions.durationHelper')}
                  />

                  <Input
                    label={t('sessions.cost')}
                    type="number"
                    value={formData.cost}
                    onChange={(e) => handleInputChange('cost', parseFloat(e.target.value))}
                    error={errors.cost}
                    min="0"
                    step="0.01"
                    helperText={t('sessions.costHelper')}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('sessions.priority')}
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                    >
                      <option value="low">{t('sessions.lowPriority')}</option>
                      <option value="normal">{t('sessions.normalPriority')}</option>
                      <option value="high">{t('sessions.highPriority')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('sessions.notes')}
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                    placeholder={t('sessions.notesPlaceholder')}
                  />
                </div>
              </Card.Content>
            </Card>

            {/* Medical Information */}
            {(formData.status === 'completed' || formData.status === 'in-progress') && (
              <Card>
                <Card.Header>
                  <Card.Title className="flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t('sessions.medicalInfo')}
                  </Card.Title>
                </Card.Header>
                <Card.Content className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('sessions.diagnosis')}
                    </label>
                    <textarea
                      value={formData.diagnosis}
                      onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                      placeholder={t('sessions.diagnosisPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('sessions.treatment')}
                    </label>
                    <textarea
                      value={formData.treatment}
                      onChange={(e) => handleInputChange('treatment', e.target.value)}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                      placeholder={t('sessions.treatmentPlaceholder')}
                    />
                  </div>
                </Card.Content>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>{t('sessions.sessionStatus')}</Card.Title>
              </Card.Header>
              <Card.Content>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('sessions.status')}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                  >
                    <option value="scheduled">{t('sessions.scheduled')}</option>
                    <option value="in-progress">{t('sessions.inProgress')}</option>
                    <option value="completed">{t('sessions.completed')}</option>
                    <option value="cancelled">{t('sessions.cancelled')}</option>
                  </select>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>{t('sessions.sessionInfo')}</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('sessions.created')}:</span>
                    <span>{formatDateTime(session.createdAt)}</span>
                  </div>
                  {session.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('sessions.updated')}:</span>
                      <span>{formatDateTime(session.updatedAt)}</span>
                    </div>
                  )}
                  {session.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('sessions.completed')}:</span>
                      <span>{formatDateTime(session.completedAt)}</span>
                    </div>
                  )}
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
                    {saving ? t('common.saving') : t('sessions.updateSession')}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/sessions/${id}`)}
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

export default EditSession;
