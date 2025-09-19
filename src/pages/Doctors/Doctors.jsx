import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Stethoscope,
  Users,
  Star,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { usersService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatDate, getStatusColor, cn } from '../../utils';

const Doctors = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showError } = useToast();

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, [pagination.page, searchTerm, selectedSpecialization]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        role: 'doctor'
      };

      const response = await usersService.getUsers(params);
      const doctorsData = response.data?.data || [];
      
      // Filter by specialization if selected
      const filteredDoctors = selectedSpecialization 
        ? doctorsData.filter(doc => doc.specialization === selectedSpecialization)
        : doctorsData;
      
      setDoctors(filteredDoctors);
      setPagination(prev => ({
        ...prev,
        total: filteredDoctors.length,
        pages: Math.ceil(filteredDoctors.length / pagination.limit)
      }));
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
      setPagination(prev => ({ ...prev, total: 0, pages: 1 }));
      showError(t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      // Get unique specializations from mock users
      const response = await usersService.getUsers({ role: 'doctor' });
      const doctorsData = response.data?.data || [];
      const uniqueSpecializations = [...new Set(doctorsData.map(doc => doc.specialization).filter(Boolean))];
      setSpecializations(uniqueSpecializations);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      setSpecializations([]);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSpecializationFilter = (e) => {
    setSelectedSpecialization(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطبيب؟')) {
      return;
    }

    try {
      await usersService.deleteUser(doctorId);
      showSuccess('تم حذف الطبيب بنجاح');
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
      showError('حدث خطأ أثناء حذف الطبيب');
    }
  };

  const DoctorCard = ({ doctor }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xl font-medium text-white">
                  {doctor.name?.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {doctor.name}
                </h3>
                <p className="text-blue-600 font-medium">
                  {doctor.specialization}
                </p>
                {doctor.department && (
                  <p className="text-sm text-gray-600">
                    {doctor.department}
                  </p>
                )}
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
                    to={`/doctors/${doctor.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Eye className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                    عرض التفاصيل
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <>
                      <Link
                        to={`/doctors/${doctor.id}/edit`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Edit className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                        تعديل البيانات
                      </Link>
                      
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleDeleteDoctor(doctor.id);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
                        حذف الطبيب
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {/* Contact Information */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{doctor.phone}</span>
            </div>

            {doctor.email && (
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{doctor.email}</span>
              </div>
            )}

            {/* Experience */}
            {doctor.experience && (
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-gray-600">
                <Stethoscope className="w-4 h-4" />
                <span>{doctor.experience} {t('doctors.yearsExperience')}</span>
              </div>
            )}

            {/* Patients Count */}
            {doctor.patientsCount !== undefined && (
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{doctor.patientsCount} {t('doctors.patients')}</span>
              </div>
            )}

            {/* Rating */}
            {doctor.rating && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(doctor.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {doctor.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {t('doctors.joinedOn')} {formatDate(doctor.createdAt)}
              </span>
            </div>

            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getStatusColor(doctor.isActive ? 'active' : 'inactive')
            )}>
              {doctor.isActive ? t('doctors.active') : t('doctors.inactive')}
            </span>
          </div>

          {/* Availability */}
          {doctor.availability && doctor.availability.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {t('doctors.availability')}:
              </p>
              <div className="flex flex-wrap gap-1">
                {doctor.availability.map((day, index) => (
                  <span
                    key={index}
                    className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                  >
                    {t(`days.${day.day}`)} {day.startTime}-{day.endTime}
                  </span>
                ))}
              </div>
            </div>
          )}
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
            {t('doctors.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('doctors.subtitle', 'إدارة ومتابعة الأطباء')}
          </p>
        </div>
        
        {/* Add Doctor Button - Only for Admin */}
        {user?.role === 'admin' && (
          <div className="mt-4 sm:mt-0">
            <Link to="/doctors/add">
              <Button className="bg-gold-600 hover:bg-gold-700 text-white">
                <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {t('doctors.addDoctor', 'إضافة دكتور')}
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('doctors.totalDoctors')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.total}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('doctors.activeDoctors')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(doctors) ? doctors.filter(d => d.isActive).length : 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Filter className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('doctors.specializations')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {specializations.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4">
              <p className="text-sm font-medium text-gray-600">
                {t('doctors.avgRating')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {doctors.length > 0 
                  ? (doctors.reduce((sum, d) => sum + (d.rating || 0), 0) / doctors.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <Input
            placeholder={t('doctors.searchDoctors')}
            value={searchTerm}
            onChange={handleSearch}
            icon={<Search className="w-4 h-4" />}
          />

          {/* Specialization Filter */}
          <select
            value={selectedSpecialization}
            onChange={handleSpecializationFilter}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            <option value="">{t('common.allSpecializations', 'جميع التخصصات')}</option>
            {Array.isArray(specializations) && specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Doctors Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text={t('common.loading')} />
        </div>
      ) : doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(doctors) && doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('doctors.noDoctors')}
          </h3>
          <p className="text-gray-600">
            {t('doctors.noDoctorsDescription', 'لا يوجد أطباء مطابقون لمعايير البحث')}
          </p>
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

export default Doctors;
