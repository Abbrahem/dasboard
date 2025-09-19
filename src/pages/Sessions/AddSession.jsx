import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, ArrowLeft, ArrowRight, Calendar, Clock, User, Stethoscope, DollarSign } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { sessionsService, patientsService, usersService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const AddSession = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showError, showSuccess } = useToast();

  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patient: searchParams.get('patient') || '',
    doctor: searchParams.get('doctor') || '',
    scheduledDateTime: '',
    type: 'consultation',
    duration: 30,
    cost: '',
    notes: '',
    priority: 'normal'
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientsService.getPatients({ limit: 100 });
      setPatients(response.data?.data?.patients || response.data?.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await usersService.getUsers({ role: 'doctor', limit: 100 });
      setDoctors(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || '' : value
    }));

    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.patient) {
      errors.patient = t('validation.required');
    }
    if (!formData.doctor) {
      errors.doctor = t('validation.required');
    }
    if (!formData.scheduledDateTime) {
      errors.scheduledDateTime = t('validation.required');
    } else {
      const selectedDate = new Date(formData.scheduledDateTime);
      const now = new Date();
      if (selectedDate <= now) {
        errors.scheduledDateTime = t('sessions.pastDateError');
      }
    }
    if (!formData.duration || formData.duration <= 0) {
      errors.duration = t('validation.positiveNumber');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Convert datetime to separate date and time for mock data
      const sessionData = {
        ...formData,
        patientId: parseInt(formData.patient),
        doctorId: parseInt(formData.doctor),
        date: formData.scheduledDateTime.split('T')[0],
        time: formData.scheduledDateTime.split('T')[1],
        fee: parseFloat(formData.cost) || 0
      };
      
      await sessionsService.createSession(sessionData);
      showSuccess(t('sessions.sessionAdded'));
      navigate('/sessions');
    } catch (error) {
      console.error('Error creating session:', error);
      showError(error.response?.data?.message || t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = i18n.language === 'ar' ? ArrowRight : ArrowLeft;

  const sessionTypes = [
    { value: 'assessment', label: 'تقييم أولي' },
    { value: 'treatment', label: 'جلسة علاج' },
    { value: 'follow-up', label: 'متابعة' },
    { value: 'rehabilitation', label: 'إعادة تأهيل' },
    { value: 'exercise', label: 'تمارين علاجية' },
    { value: 'massage', label: 'تدليك علاجي' },
    { value: 'electrotherapy', label: 'علاج كهربائي' },
    { value: 'hydrotherapy', label: 'علاج مائي' }
  ];

  const priorityOptions = [
    { value: 'low', label: t('sessions.lowPriority') },
    { value: 'normal', label: t('sessions.normalPriority') },
    { value: 'high', label: t('sessions.highPriority') },
    { value: 'urgent', label: t('sessions.urgentPriority') }
  ];

  // Generate time slots for today and future dates
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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
              {t('sessions.addSession')}
            </h1>
            <p className="text-gray-600">
              {t('sessions.addSessionDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <Card.Header>
            <Card.Title>{t('sessions.basicInfo')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('sessions.patient')} <span className="text-red-500">*</span>
                </label>
                <select
                  name="patient"
                  value={formData.patient}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 ${
                    validationErrors.patient ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">اختر المريض</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.phone}
                    </option>
                  ))}
                </select>
                {validationErrors.patient && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.patient}</p>
                )}
              </div>

              {/* Doctor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('sessions.doctor')} <span className="text-red-500">*</span>
                </label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 ${
                    validationErrors.doctor ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">اختر الطبيب</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization} ({doctor.department})
                    </option>
                  ))}
                </select>
                {validationErrors.doctor && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.doctor}</p>
                )}
              </div>

              {/* Session Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('sessions.type')}
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                >
                  {sessionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('sessions.priority')}
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Schedule Information */}
        <Card>
          <Card.Header>
            <Card.Title>{t('sessions.scheduleInfo')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date and Time */}
              <div className="md:col-span-2">
                <Input
                  label={t('sessions.dateTime')}
                  name="scheduledDateTime"
                  type="datetime-local"
                  value={formData.scheduledDateTime}
                  onChange={handleInputChange}
                  error={validationErrors.scheduledDateTime}
                  required
                  icon={<Calendar className="w-5 h-5" />}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {/* Duration */}
              <Input
                label={t('sessions.duration')}
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
                error={validationErrors.duration}
                required
                icon={<Clock className="w-5 h-5" />}
                helperText={t('sessions.durationHelper')}
                min="15"
                max="240"
                step="15"
              />
            </div>
          </Card.Content>
        </Card>

        {/* Additional Information */}
        <Card>
          <Card.Header>
            <Card.Title>{t('sessions.additionalInfo')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-6">
              {/* Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label={t('sessions.cost')}
                  name="cost"
                  type="number"
                  value={formData.cost}
                  onChange={handleInputChange}
                  icon={<DollarSign className="w-5 h-5" />}
                  helperText={t('sessions.costHelper')}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('sessions.notes')}
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
                  placeholder={t('sessions.notesPlaceholder')}
                />
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Quick Time Slots */}
        <Card>
          <Card.Header>
            <Card.Title>{t('sessions.quickTimeSlots')}</Card.Title>
            <Card.Description>
              {t('sessions.quickTimeSlotsDescription')}
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {timeSlots.slice(0, 16).map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const dateStr = today.toISOString().split('T')[0];
                    setFormData(prev => ({
                      ...prev,
                      scheduledDateTime: `${dateStr}T${time}`
                    }));
                  }}
                  className="text-xs"
                >
                  {time}
                </Button>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/sessions')}
          >
            {t('common.cancel')}
          </Button>
          
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            icon={<Save className="w-4 h-4" />}
            className="medical-gradient text-white"
          >
            {t('sessions.saveSession')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSession;
