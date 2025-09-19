import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  ArrowRight, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  User, 
  Heart, 
  AlertTriangle,
  FileText,
  Activity,
  CreditCard,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { patientsService, sessionsService, paymentsService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatDate, formatDateTime, calculateAge, getStatusColor, formatCurrency, cn } from '../../utils';

const PatientDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [patient, setPatient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      const [patientRes, sessionsRes, paymentsRes] = await Promise.all([
        patientsAPI.getPatient(id),
        sessionsAPI.getSessionsByPatient(id),
        paymentsAPI.getPaymentsByPatient(id)
      ]);

      setPatient(patientRes.data.patient);
      setSessions(sessionsRes.data.sessions);
      setPayments(paymentsRes.data.payments);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      showError(t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!window.confirm(t('patients.confirmDelete'))) {
      return;
    }

    try {
      await patientsAPI.deletePatient(id);
      showSuccess(t('patients.patientDeleted'));
      navigate('/patients');
    } catch (error) {
      console.error('Error deleting patient:', error);
      showError(t('messages.error.general'));
    }
  };

  const ArrowIcon = i18n.language === 'ar' ? ArrowRight : ArrowLeft;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('patients.patientNotFound')}
        </h3>
        <Button
          as={Link}
          to="/patients"
          variant="outline"
          icon={<ArrowIcon className="w-4 h-4" />}
        >
          {t('common.back')}
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: t('patients.overview'), icon: User },
    { id: 'sessions', label: t('patients.sessions'), icon: Activity },
    { id: 'payments', label: t('patients.payments'), icon: CreditCard },
    { id: 'history', label: t('patients.medicalHistory'), icon: FileText }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Information */}
      <div className="lg:col-span-2">
        <Card>
          <Card.Header>
            <Card.Title>{t('patients.personalInfo')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('patients.name')}
                  </label>
                  <p className="text-lg font-semibold text-gray-900">{patient.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('patients.age')}
                  </label>
                  <p className="text-gray-900">
                    {calculateAge(patient.dateOfBirth)} {t('patients.years')}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('patients.gender')}
                  </label>
                  <p className="text-gray-900">
                    {patient.gender === 'male' ? t('patients.male') : t('patients.female')}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('patients.bloodType')}
                  </label>
                  <p className="text-gray-900">{patient.bloodType || t('common.notSpecified')}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('patients.phone')}
                  </label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{patient.phone}</p>
                  </div>
                </div>
                
                {patient.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t('patients.email')}
                    </label>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{patient.email}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('patients.registrationDate')}
                  </label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{formatDate(patient.registrationDate)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('patients.status')}
                  </label>
                  <span className={cn(
                    "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                    getStatusColor(patient.isActive ? 'active' : 'inactive')
                  )}>
                    {patient.isActive ? t('patients.active') : t('patients.inactive')}
                  </span>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Address */}
        {patient.address && (
          <Card className="mt-6">
            <Card.Header>
              <Card.Title>{t('patients.address')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-900">
                    {patient.address.street}
                  </p>
                  <p className="text-gray-600">
                    {patient.address.city}, {patient.address.state} {patient.address.zipCode}
                  </p>
                  <p className="text-gray-600">{patient.address.country}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}
      </div>

      {/* Medical Information & Emergency Contact */}
      <div className="space-y-6">
        {/* Medical Information */}
        <Card>
          <Card.Header>
            <Card.Title>{t('patients.medicalInfo')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {patient.allergies && patient.allergies.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1 text-red-500" />
                    {t('patients.allergies')}
                  </label>
                  <div className="mt-1 space-y-1">
                    {patient.allergies.map((allergy, index) => (
                      <span key={index} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-1 rtl:mr-0 rtl:ml-1">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {patient.chronicDiseases && patient.chronicDiseases.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center">
                    <Heart className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1 text-blue-500" />
                    {t('patients.chronicDiseases')}
                  </label>
                  <div className="mt-1 space-y-1">
                    {patient.chronicDiseases.map((disease, index) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 rtl:mr-0 rtl:ml-1">
                        {disease}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {patient.currentMedications && patient.currentMedications.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('patients.currentMedications')}
                  </label>
                  <div className="mt-1 space-y-1">
                    {patient.currentMedications.map((medication, index) => (
                      <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-1 rtl:mr-0 rtl:ml-1">
                        {medication}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Emergency Contact */}
        {patient.emergencyContact && (
          <Card>
            <Card.Header>
              <Card.Title>{t('patients.emergencyContact')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('patients.name')}
                  </label>
                  <p className="text-gray-900">{patient.emergencyContact.name}</p>
                </div>
                
                {patient.emergencyContact.relationship && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      {t('patients.relationship')}
                    </label>
                    <p className="text-gray-900">{patient.emergencyContact.relationship}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {t('patients.phone')}
                  </label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{patient.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Assigned Doctor */}
        {patient.assignedDoctor && (
          <Card>
            <Card.Header>
              <Card.Title>{t('patients.assignedDoctor')}</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {patient.assignedDoctor.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{patient.assignedDoctor.name}</p>
                  <p className="text-sm text-gray-600">{patient.assignedDoctor.specialization}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {t('patients.sessions')} ({sessions.length})
        </h3>
        <Button
          as={Link}
          to={`/sessions/add?patient=${patient._id}`}
          icon={<Plus className="w-4 h-4" />}
          size="sm"
          className="medical-gradient text-white"
        >
          {t('sessions.addSession')}
        </Button>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session._id} className="hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div>
                        <p className="font-medium text-gray-900">
                          {session.type || t('sessions.generalConsultation')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.doctor?.name} • {formatDateTime(session.scheduledDateTime)}
                        </p>
                      </div>
                    </div>
                    
                    {session.diagnosis && (
                      <p className="text-sm text-gray-700 mt-2">
                        <strong>{t('sessions.diagnosis')}:</strong> {session.diagnosis}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right rtl:text-left">
                    <span className={cn(
                      "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(session.status)
                    )}>
                      {t(`sessions.${session.status}`)}
                    </span>
                    
                    {session.cost && (
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatCurrency(session.cost)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('patients.noSessions')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('patients.noSessionsDescription')}
          </p>
          <Button
            as={Link}
            to={`/sessions/add?patient=${patient._id}`}
            icon={<Plus className="w-4 h-4" />}
            className="medical-gradient text-white"
          >
            {t('sessions.addSession')}
          </Button>
        </div>
      )}
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {t('patients.payments')} ({payments.length})
        </h3>
        <Button
          as={Link}
          to={`/payments/add?patient=${patient._id}`}
          icon={<Plus className="w-4 h-4" />}
          size="sm"
          className="medical-gradient text-white"
        >
          {t('payments.addPayment')}
        </Button>
      </div>

      {payments.length > 0 ? (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment._id} className="hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {payment.method} • {formatDate(payment.createdAt)}
                        </p>
                        {payment.description && (
                          <p className="text-sm text-gray-700 mt-1">
                            {payment.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right rtl:text-left">
                    <span className={cn(
                      "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                      getStatusColor(payment.status)
                    )}>
                      {t(`payments.${payment.status}`)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('patients.noPayments')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('patients.noPaymentsDescription')}
          </p>
          <Button
            as={Link}
            to={`/payments/add?patient=${patient._id}`}
            icon={<Plus className="w-4 h-4" />}
            className="medical-gradient text-white"
          >
            {t('payments.addPayment')}
          </Button>
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">
        {t('patients.medicalHistory')}
      </h3>
      
      {patient.notes ? (
        <Card>
          <Card.Header>
            <Card.Title>{t('patients.notes')}</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-700 whitespace-pre-wrap">{patient.notes}</p>
          </Card.Content>
        </Card>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('patients.noHistory')}
          </h3>
          <p className="text-gray-600">
            {t('patients.noHistoryDescription')}
          </p>
        </div>
      )}
    </div>
  );

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
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-lg font-medium text-white">
                {patient.name?.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <p className="text-gray-600">
                {calculateAge(patient.dateOfBirth)} {t('patients.years')} • {patient.phone}
              </p>
            </div>
          </div>
        </div>

        {user?.canModifyPatients() && (
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Button
              as={Link}
              to={`/patients/${patient._id}/edit`}
              variant="outline"
              icon={<Edit className="w-4 h-4" />}
            >
              {t('common.edit')}
            </Button>
            
            <Button
              variant="danger"
              onClick={handleDeletePatient}
              icon={<Trash2 className="w-4 h-4" />}
            >
              {t('common.delete')}
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 rtl:space-x-reverse">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 rtl:space-x-reverse py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-gold-500 text-gold-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'sessions' && renderSessions()}
        {activeTab === 'payments' && renderPayments()}
        {activeTab === 'history' && renderHistory()}
      </div>
    </div>
  );
};

export default PatientDetails;
