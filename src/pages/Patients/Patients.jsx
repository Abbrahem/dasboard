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
  Phone,
  Mail,
  Calendar,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { patientsService, usersService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatDate, getStatusColor, calculateAge, cn } from '../../utils';

const Patients = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, [pagination.page, searchTerm, selectedDoctor, statusFilter]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        doctor: selectedDoctor || undefined,
        status: statusFilter
      };

      const response = await patientsService.getPatients(params);
      setPatients(response.data?.data?.patients || response.data?.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.data?.data?.total || response.data?.data?.length || 0,
        pages: response.data?.data?.totalPages || Math.ceil((response.data?.data?.length || 0) / pagination.limit)
      }));
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
      setPagination(prev => ({ ...prev, total: 0, pages: 1 }));
      showError(t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await usersService.getDoctors();
      setDoctors(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDoctorFilter = (e) => {
    setSelectedDoctor(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm(t('patients.confirmDelete'))) {
      return;
    }

    try {
      await patientsService.deletePatient(patientId);
      showSuccess(t('patients.patientDeleted'));
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      showError(t('messages.error.general'));
    }
  };

  const PatientCard = ({ patient }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {patient.name?.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {patient.name}
                </h3>
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    {patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : 'غير محدد'} {patient.dateOfBirth ? t('patients.years', 'سنة') : ''}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                    {patient.phone}
                  </span>
                  {patient.email && (
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                      {patient.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

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
                    to={`/patients/${patient.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Eye className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                    عرض التفاصيل
                  </Link>
                  
                  {(user?.role === 'admin' || user?.role === 'receptionist') && (
                    <>
                      <Link
                        to={`/patients/${patient.id}/edit`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Edit className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                        تعديل البيانات
                      </Link>
                      
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleDeletePatient(patient.id);
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

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm">
              <span className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                {formatDate(patient.createdAt)}
              </span>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor('active')
              )}>
                {t('patients.active')}
              </span>
            </div>

          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('patients.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('patients.subtitle', 'إدارة ومتابعة المرضى')}
          </p>
        </div>
        
        {(user?.role === 'admin' || user?.role === 'receptionist') && (
          <div className="mt-4 sm:mt-0">
            <Link to="/patients/add">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                إضافة مريض جديد
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <Input
            placeholder={t('patients.searchPatients')}
            value={searchTerm}
            onChange={handleSearch}
            icon={<Search className="w-4 h-4" />}
          />

          {/* Doctor Filter */}
          <select
            value={selectedDoctor}
            onChange={handleDoctorFilter}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            <option value="">{t('common.allDoctors', 'جميع الأطباء')}</option>
            {Array.isArray(doctors) && doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialization}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              variant={statusFilter === 'active' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('active')}
              className="flex-1"
            >
              {t('patients.active')}
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('inactive')}
              className="flex-1"
            >
              {t('patients.inactive')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Patients List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text={t('common.loading')} />
        </div>
      ) : patients.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.isArray(patients) && patients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('patients.noPatients')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('patients.noPatientsDescription', 'لا يوجد مرضى مطابقون لمعايير البحث')}
          </p>
          {(user?.role === 'admin' || user?.role === 'receptionist') && (
            <Button
              as={Link}
              to="/patients/add"
              icon={<Plus className="w-4 h-4" />}
              className="medical-gradient text-white"
            >
              {t('patients.addPatient')}
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

export default Patients;
