import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, User, Settings, Menu } from 'lucide-react';
import { teacher, notifications } from '../../data/mockData';
import { Avatar } from '../ui/SharedComponents';

export default function TopBar({ onToggleSidebar, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [pulse, setPulse] = useState(true);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-[rgba(0,0,0,0.06)] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-surface-500 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className={`relative transition-all duration-300 ${searchFocused ? 'w-72' : 'w-48 md:w-64'}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search classes, students..."
            className="w-full bg-surface-100 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2.5 rounded-full hover:bg-surface-100 text-surface-500 transition-all duration-200 hover:text-surface-700"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className={`absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ${pulse ? 'animate-pulse' : 'animate-scale-in'}`}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative ml-1">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full hover:bg-surface-100 transition-all duration-200"
          >
            <Avatar name={teacher.name} size="sm" className="ring-2 ring-white/20" />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-surface-800 leading-none mb-1">{teacher.name}</p>
              <p className="text-[11px] text-surface-500 leading-none">CSE</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-surface-400 hidden md:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-surface-100 p-1.5 animate-scale-in origin-top-right z-50">
              <div className="px-3 py-3 border-b border-surface-100">
                <p className="font-semibold text-sm text-surface-800">{teacher.name}</p>
                <p className="text-xs text-surface-500 truncate">{teacher.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-surface-600 hover:bg-surface-50 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" /> My Profile
                </button>
                <button
                  onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-surface-600 hover:bg-surface-50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>
              </div>
              <div className="border-t border-surface-100 pt-1">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
