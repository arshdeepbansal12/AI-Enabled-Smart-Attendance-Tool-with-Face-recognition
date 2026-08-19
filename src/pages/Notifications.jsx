import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ShieldAlert, AlertTriangle, Info, Bell, Check, X, Filter } from 'lucide-react';
import { notifications as initialNotifications } from '../data/mockData';
import { EmptyState } from '../components/ui/SharedComponents';

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = [
    { id: 'All', label: 'All', count: notifications.length },
    { id: 'Flagged Attempts', label: 'Flagged Attempts', count: notifications.filter(n => n.category === 'flagged').length },
    { id: 'System Alerts', label: 'System Alerts', count: notifications.filter(n => n.category === 'system').length }
  ];

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Flagged Attempts') return n.category === 'flagged';
    if (activeTab === 'System Alerts') return n.category === 'system';
    return true;
  });

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (severity) => {
    switch(severity) {
      case 'critical': return <ShieldAlert className="w-5 h-5 text-danger-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      default: return <Info className="w-5 h-5 text-primary-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500 mt-1">Manage alerts and system notifications.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Check className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <EmptyState 
            icon={Bell} 
            title="No notifications" 
            description={`You're all caught up! No ${activeTab !== 'All' ? activeTab.toLowerCase() : 'new'} notifications to display.`}
          />
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`card relative overflow-hidden transition-all duration-200 ${
                !notification.read ? 'bg-white shadow-md border-l-4 border-l-primary-500' : 'bg-slate-50/50 border border-slate-200 opacity-75'
              }`}
            >
              <div className="p-4 flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => markAsRead(notification.id)}>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className={`font-semibold text-sm truncate ${!notification.read ? 'text-slate-800' : 'text-slate-600'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm ${!notification.read ? 'text-slate-600' : 'text-slate-500'}`}>
                    {notification.message}
                  </p>
                </div>
                <button 
                  onClick={() => dismissNotification(notification.id)}
                  className="flex-shrink-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors self-start"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
