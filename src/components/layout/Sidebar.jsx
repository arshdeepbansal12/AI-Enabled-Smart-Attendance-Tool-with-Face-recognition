import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  Bell,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Fingerprint,
} from 'lucide-react';

const mainNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/students', label: 'Students', icon: Users },
];

const systemNavItems = [
  { path: '/notifications', label: 'Alerts', icon: Bell },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/profile', label: 'Profile', icon: UserCircle },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const renderNavGroup = (items) => (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <NavLink
            key={item.path}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200 group relative ${
              active
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-900/30'
                : 'text-surface-400 hover:text-white hover:bg-white/5 hover:scale-[1.02]'
            } ${collapsed ? 'justify-center' : ''}`}
          >
            {active && !collapsed && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3/4 bg-white/50 rounded-r-full" />
            )}
            <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`} />
            {!collapsed && <span className="animate-fade-in">{item.label}</span>}
          </NavLink>
        );
      })}
    </div>
  );

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 py-5 border-b border-white/5 ${collapsed ? 'px-3 justify-center' : 'px-5'}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
          <Fingerprint className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-white font-bold text-lg leading-tight">SmartAttend</h1>
            <p className="text-indigo-300 text-[11px] font-medium">Teacher Portal</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto space-y-6">
        {renderNavGroup(mainNavItems)}
        <div className="h-px w-full bg-white/5" />
        {renderNavGroup(systemNavItems)}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 pb-4">
        <button
          onClick={onToggle}
          title={collapsed ? "Expand" : undefined}
          className={`w-full flex items-center gap-2 py-3 rounded-xl text-surface-500 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-medium ${collapsed ? 'justify-center px-0' : 'px-4 justify-center'}`}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom branding */}
      {!collapsed && (
        <div className="px-5 pb-5 animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-indigo-200/50 bg-white/5 py-2 rounded-lg text-xs font-medium">
            <GraduationCap className="w-4 h-4" />
            <span>AI Attendance v2.4</span>
          </div>
        </div>
      )}
    </aside>
  );
}
