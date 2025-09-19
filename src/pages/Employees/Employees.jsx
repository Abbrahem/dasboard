import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Mail, 
  Phone,
  MoreVertical,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { usersService } from '../../services/mockService';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatDate, cn } from '../../utils';

const Employees = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, roleFilter, statusFilter]);

  const fetchEmployees = async () => {
    try {
      const response = await usersService.getUsers();
      // Filter out patients and only show staff members
      const users = response.data?.data || [];
      const staffMembers = Array.isArray(users) ? users.filter(user => 
        user.role !== 'patient' && user.role !== 'admin'
      ) : [];
      setEmployees(staffMembers);
    } catch (error) {
      console.error('Error fetching employees:', error);
      showError(t('messages.error.general'));
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone?.includes(searchTerm)
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(employee => employee.role === roleFilter);
    }

    if (statusFilter) {
      const isActive = statusFilter === 'active';
      filtered = filtered.filter(employee => employee.isActive === isActive);
    }

    setFilteredEmployees(filtered);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm(t('employees.confirmDelete'))) {
      return;
    }

    try {
      await usersAPI.deleteUser(employeeId);
      setEmployees(prev => prev.filter(emp => emp._id !== employeeId));
      showSuccess(t('employees.employeeDeleted'));
    } catch (error) {
      console.error('Error deleting employee:', error);
      showError(error.response?.data?.message || t('messages.error.general'));
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'receptionist':
        return 'bg-green-100 text-green-800';
      case 'nurse':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('employees.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('employees.subtitle', 'إدارة الموظفين والطاقم الطبي')}
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <div className="mt-4 sm:mt-0">
            <Link to="/employees/add">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                إضافة موظف جديد
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder={t('employees.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-5 h-5" />}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            <option value="">{t('common.allRoles')}</option>
            <option value="doctor">{t('users.doctor')}</option>
            <option value="receptionist">{t('users.receptionist')}</option>
            <option value="nurse">{t('users.nurse')}</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500"
          >
            <option value="">{t('common.allStatuses')}</option>
            <option value="active">{t('common.active')}</option>
            <option value="inactive">{t('common.inactive')}</option>
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
            {filteredEmployees.length} {t('employees.employees')}
          </div>
        </div>
      </Card>

      {/* Employees List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee._id} className="hover:shadow-lg transition-shadow">
            <Card.Content className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {employee.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{employee.name}</h3>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                      <span className={cn(
                        "inline-block px-2 py-1 text-xs font-medium rounded-full",
                        getRoleBadgeColor(employee.role)
                      )}>
                        {t(`users.${employee.role}`)}
                      </span>
                      <span className={cn(
                        "inline-block px-2 py-1 text-xs font-medium rounded-full",
                        getStatusBadgeColor(employee.isActive)
                      )}>
                        {employee.isActive ? t('common.active') : t('common.inactive')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.specialization && (
                  <div className="text-sm text-gray-600">
                    <strong>{t('employees.specialization')}:</strong> {employee.specialization}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 mb-4">
                {t('employees.joinedOn')} {formatDate(employee.createdAt)}
              </div>

              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button
                  as={Link}
                  to={`/employees/${employee._id}`}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  icon={<Eye className="w-3 h-3" />}
                >
                  {t('common.view')}
                </Button>

                {user?.role === 'admin' && (
                  <>
                    <Button
                      as={Link}
                      to={`/employees/${employee._id}/edit`}
                      size="sm"
                      variant="outline"
                      icon={<Edit className="w-3 h-3" />}
                    >
                      {t('common.edit')}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteEmployee(employee._id)}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                      icon={<Trash2 className="w-3 h-3" />}
                    >
                      {t('common.delete')}
                    </Button>
                  </>
                )}
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('employees.noEmployees')}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || roleFilter || statusFilter
              ? t('employees.noEmployeesFiltered')
              : t('employees.noEmployeesYet')
            }
          </p>
          {user?.role === 'admin' && !searchTerm && !roleFilter && !statusFilter && (
            <Button
              as={Link}
              to="/employees/add"
              icon={<Plus className="w-4 h-4" />}
              className="medical-gradient text-white"
            >
              {t('employees.addFirstEmployee')}
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default Employees;
