import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, ArrowLeft, ArrowRight, User, Phone, Mail, Calendar, MapPin, Heart, AlertCircle } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { patientsService, usersService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { isValidEmail, isValidPhone } from '../../utils';

const AddPatient = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    dateOfBirth: '',
    gender: 'male',
    phone: '',
    email: '',
    nationalId: '',
    
    // Address
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Saudi Arabia'
    },
    
    // Medical Information
    bloodType: '',
    allergies: [],
    chronicDiseases: [],
    currentMedications: [],
    
    // Emergency Contact
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    
    // Assigned Doctor
    assignedDoctorId: '',
    
    // Additional Notes
    notes: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await usersService.getUsers({ role: 'doctor' });
      setDoctors(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.name.trim()) {
          errors.name = t('validation.required');
        }
        if (!formData.dateOfBirth) {
          errors.dateOfBirth = t('validation.required');
        }
        if (!formData.phone.trim()) {
          errors.phone = t('validation.required');
        } else if (!isValidPhone(formData.phone)) {
          errors.phone = t('validation.phone');
        }
        if (formData.email && !isValidEmail(formData.email)) {
          errors.email = t('validation.email');
        }
        if (!formData.assignedDoctorId) {
          errors.assignedDoctorId = 'يجب اختيار الطبيب المعالج';
        }
        break;

      case 2: // Address
        if (!formData.address.street.trim()) {
          errors['address.street'] = t('validation.required');
        }
        if (!formData.address.city.trim()) {
          errors['address.city'] = t('validation.required');
        }
        break;

      case 3: // Medical Information
        // Optional validation for medical info
        break;

      case 4: // Emergency Contact & Assignment
        if (!formData.emergencyContact.name.trim()) {
          errors['emergencyContact.name'] = t('validation.required');
        }
        if (!formData.emergencyContact.phone.trim()) {
          errors['emergencyContact.phone'] = t('validation.required');
        } else if (!isValidPhone(formData.emergencyContact.phone)) {
          errors['emergencyContact.phone'] = t('validation.phone');
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);

    try {
      // Clean up empty array items
      const cleanedData = {
        ...formData,
        allergies: formData.allergies.filter(item => item.trim()),
        chronicDiseases: formData.chronicDiseases.filter(item => item.trim()),
        currentMedications: formData.currentMedications.filter(item => item.trim())
      };

      await patientsService.createPatient(cleanedData);
      showSuccess(t('patients.patientAdded'));
      navigate('/patients');
    } catch (error) {
      console.error('Error creating patient:', error);
      showError(error.response?.data?.message || t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const ArrowIcon = i18n.language === 'ar' ? ArrowRight : ArrowLeft;

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t('patients.name')}
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          error={validationErrors.name}
          required
          icon={<User className="w-5 h-5" />}
        />

        <Input
          label={t('patients.dateOfBirth')}
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          error={validationErrors.dateOfBirth}
          required
          icon={<Calendar className="w-5 h-5" />}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('patients.gender')} <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            <option value="male">{t('patients.male')}</option>
            <option value="female">{t('patients.female')}</option>
          </select>
        </div>

        <Input
          label={t('patients.phone')}
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          error={validationErrors.phone}
          required
          icon={<Phone className="w-5 h-5" />}
        />

        <Input
          label={t('patients.email')}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          error={validationErrors.email}
          icon={<Mail className="w-5 h-5" />}
        />

        <Input
          label={t('patients.nationalId')}
          name="nationalId"
          value={formData.nationalId}
          onChange={handleInputChange}
          error={validationErrors.nationalId}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الطبيب المعالج <span className="text-red-500">*</span>
          </label>
          <select
            name="assignedDoctorId"
            value={formData.assignedDoctorId}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            <option value="">اختر الطبيب المعالج</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization} ({doctor.department})
              </option>
            ))}
          </select>
          {validationErrors.assignedDoctorId && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.assignedDoctorId}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t('patients.street')}
          name="address.street"
          value={formData.address.street}
          onChange={handleInputChange}
          error={validationErrors['address.street']}
          required
          icon={<MapPin className="w-5 h-5" />}
        />

        <Input
          label={t('patients.city')}
          name="address.city"
          value={formData.address.city}
          onChange={handleInputChange}
          error={validationErrors['address.city']}
          required
        />

        <Input
          label={t('patients.state')}
          name="address.state"
          value={formData.address.state}
          onChange={handleInputChange}
        />

        <Input
          label={t('patients.zipCode')}
          name="address.zipCode"
          value={formData.address.zipCode}
          onChange={handleInputChange}
        />

        <Input
          label={t('patients.country')}
          name="address.country"
          value={formData.address.country}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('patients.bloodType')}
          </label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleInputChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            <option value="">{t('common.select')}</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      {/* Allergies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('patients.allergies')}
        </label>
        {formData.allergies.map((allergy, index) => (
          <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
            <Input
              value={allergy}
              onChange={(e) => handleArrayInputChange('allergies', index, e.target.value)}
              placeholder={t('patients.allergyPlaceholder')}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeArrayItem('allergies', index)}
            >
              {t('common.remove')}
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('allergies')}
        >
          {t('patients.addAllergy')}
        </Button>
      </div>

      {/* Chronic Diseases */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('patients.chronicDiseases')}
        </label>
        {formData.chronicDiseases.map((disease, index) => (
          <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
            <Input
              value={disease}
              onChange={(e) => handleArrayInputChange('chronicDiseases', index, e.target.value)}
              placeholder={t('patients.diseasePlaceholder')}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeArrayItem('chronicDiseases', index)}
            >
              {t('common.remove')}
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('chronicDiseases')}
        >
          {t('patients.addDisease')}
        </Button>
      </div>

      {/* Current Medications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('patients.currentMedications')}
        </label>
        {formData.currentMedications.map((medication, index) => (
          <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
            <Input
              value={medication}
              onChange={(e) => handleArrayInputChange('currentMedications', index, e.target.value)}
              placeholder={t('patients.medicationPlaceholder')}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeArrayItem('currentMedications', index)}
            >
              {t('common.remove')}
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addArrayItem('currentMedications')}
        >
          {t('patients.addMedication')}
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('patients.emergencyContact')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t('patients.emergencyContactName')}
            name="emergencyContact.name"
            value={formData.emergencyContact.name}
            onChange={handleInputChange}
            error={validationErrors['emergencyContact.name']}
            required
            icon={<User className="w-5 h-5" />}
          />

          <Input
            label={t('patients.relationship')}
            name="emergencyContact.relationship"
            value={formData.emergencyContact.relationship}
            onChange={handleInputChange}
          />

          <Input
            label={t('patients.emergencyContactPhone')}
            name="emergencyContact.phone"
            value={formData.emergencyContact.phone}
            onChange={handleInputChange}
            error={validationErrors['emergencyContact.phone']}
            required
            icon={<Phone className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Doctor Assignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('patients.assignedDoctor')}
        </label>
        <select
          name="assignedDoctor"
          value={formData.assignedDoctor}
          onChange={handleInputChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
        >
          <option value="">{t('common.select')}</option>
          {Array.isArray(doctors) && doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.name} - {doctor.specialization}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('patients.notes')}
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          placeholder={t('patients.notesPlaceholder')}
        />
      </div>
    </div>
  );

  const getStepTitle = (step) => {
    const titles = {
      1: t('patients.personalInfo'),
      2: t('patients.addressInfo'),
      3: t('patients.medicalInfo'),
      4: t('patients.contactAndAssignment')
    };
    return titles[step];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            variant="ghost"
            onClick={() => navigate('/patients')}
            icon={<ArrowIcon className="w-4 h-4" />}
          >
            {t('common.back')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('patients.addPatient')}
            </h1>
            <p className="text-gray-600">
              {getStepTitle(currentStep)} ({currentStep}/{totalSteps})
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-2">
        <div
          className="bg-gold-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {getStepTitle(currentStep)}
            </h2>
            
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              {t('common.previous')}
            </Button>

            <div className="flex space-x-3 rtl:space-x-reverse">
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="medical-gradient text-white"
                >
                  {t('common.next')}
                </Button>
              ) : (
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  icon={<Save className="w-4 h-4" />}
                  className="medical-gradient text-white"
                >
                  {t('patients.savePatient')}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddPatient;
