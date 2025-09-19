import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar, 
  CreditCard, 
  FileText, 
  Settings, 
  Stethoscope,
  UserCog,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils';

const Sidebar = ({ isMobile, isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useTheme();

  const navigationItems = [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'doctor', 'receptionist']
    },
    {
      name: t('navigation.patients'),
      href: '/patients',
      icon: Users,
      roles: ['admin', 'doctor', 'receptionist']
    },
    {
      name: t('navigation.doctors'),
      href: '/doctors',
      icon: Stethoscope,
      roles: ['admin', 'doctor', 'receptionist']
    },
    {
      name: t('navigation.sessions'),
      href: '/sessions',
      icon: Activity,
      roles: ['admin', 'doctor', 'receptionist']
    },
    {
      name: t('navigation.payments'),
      href: '/payments',
      icon: CreditCard,
      roles: ['admin', 'receptionist']
    },
    {
      name: t('navigation.employees'),
      href: '/employees',
      icon: UserCog,
      roles: ['admin', 'receptionist']
    },
    {
      name: t('navigation.calendar'),
      href: '/calendar',
      icon: Calendar,
      roles: ['admin', 'doctor', 'receptionist']
    },
    {
      name: t('navigation.reports'),
      href: '/reports',
      icon: FileText,
      roles: ['admin', 'receptionist']
    }
  ];

  const managementItems = [
    {
      name: t('navigation.manage'),
      href: '/manage',
      icon: UserCheck,
      roles: ['admin']
    }
  ];

  const settingsItems = [
    {
      name: t('navigation.settings'),
      href: '/settings',
      icon: Settings,
      roles: ['admin', 'doctor', 'receptionist']
    }
  ];

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const hasPermission = (roles) => {
    return roles.includes(user?.role);
  };

  const NavItem = ({ item, onClick }) => {
    if (!hasPermission(item.roles)) return null;

    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={cn(
          "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
          active 
            ? "bg-gold-100 text-gold-700 border-r-2 border-gold-500 rtl:border-r-0 rtl:border-l-2" 
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          sidebarCollapsed && !isMobile && "justify-center px-2"
        )}
        title={sidebarCollapsed && !isMobile ? item.name : undefined}
      >
        <Icon className={cn(
          "flex-shrink-0 w-5 h-5",
          !sidebarCollapsed || isMobile ? "mr-3 rtl:mr-0 rtl:ml-3" : ""
        )} />
        {(!sidebarCollapsed || isMobile) && (
          <span className="truncate">{item.name}</span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center px-4 py-6 border-b border-gray-200",
        sidebarCollapsed && !isMobile && "justify-center px-2"
      )}>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          {(!sidebarCollapsed || isMobile) && (
            <div className="ml-3 rtl:ml-0 rtl:mr-3">
              <h1 className="text-lg font-bold text-gray-900">
                مركز العلاج الطبيعي
              </h1>
              <p className="text-xs text-gray-500">
                نظام إدارة المركز
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem 
              key={item.href} 
              item={item} 
              onClick={isMobile ? onClose : undefined}
            />
          ))}
        </div>

        {/* Management Section */}
        {managementItems.some(item => hasPermission(item.roles)) && (
          <>
            <div className="pt-4">
              {(!sidebarCollapsed || isMobile) && (
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {t('navigation.manage')}
                </h3>
              )}
              <div className="space-y-1">
                {managementItems.map((item) => (
                  <NavItem 
                    key={item.href} 
                    item={item} 
                    onClick={isMobile ? onClose : undefined}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Settings Section */}
        <div className="pt-4">
          {(!sidebarCollapsed || isMobile) && (
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {t('common.settings')}
            </h3>
          )}
          <div className="space-y-1">
            {settingsItems.map((item) => (
              <NavItem 
                key={item.href} 
                item={item} 
                onClick={isMobile ? onClose : undefined}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Collapse Toggle (Desktop only) */}
      {!isMobile && (
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            title={sidebarCollapsed ? t('common.expand') : t('common.collapse')}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                <span className="text-sm">{t('common.collapse')}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Sidebar */}
        <div
          id="mobile-sidebar"
          className={cn(
            "fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden",
            isOpen ? "translate-x-0 rtl:translate-x-0" : "-translate-x-full rtl:translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 z-30 bg-white shadow-lg transition-all duration-300 ease-in-out hidden md:block",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      {sidebarContent}
    </div>
  );
};

export default Sidebar;
