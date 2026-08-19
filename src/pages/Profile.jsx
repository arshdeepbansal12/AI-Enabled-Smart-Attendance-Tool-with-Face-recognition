import React, { useState } from 'react';
import { Mail, Phone, Building, BadgeCheck, Lock, Bell, Shield, User } from 'lucide-react';
import { teacher } from '../data/mockData';
import { Avatar, Toggle } from '../components/ui/SharedComponents';

export default function Profile() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    sessionReminders: true,
    flaggedAlerts: true,
    weeklyReports: false
  });

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profile & Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="card p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar 
            name={teacher.name} 
            src={teacher.avatar} 
            size="xl" 
            className="ring-4 ring-primary-50 shadow-lg"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-800">{teacher.name}</h2>
            <p className="text-primary-600 font-medium mb-4">{teacher.designation}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <div className="flex items-center justify-center md:justify-start text-slate-600">
                <Mail className="w-4 h-4 mr-2 text-slate-400" />
                {teacher.email}
              </div>
              <div className="flex items-center justify-center md:justify-start text-slate-600">
                <Phone className="w-4 h-4 mr-2 text-slate-400" />
                {teacher.phone || '+1 (555) 0198'}
              </div>
              <div className="flex items-center justify-center md:justify-start text-slate-600">
                <Building className="w-4 h-4 mr-2 text-slate-400" />
                {teacher.department}
              </div>
              <div className="flex items-center justify-center md:justify-start text-slate-600">
                <BadgeCheck className="w-4 h-4 mr-2 text-slate-400" />
                ID: {teacher.id}
              </div>
            </div>
            
            <div className="mt-6">
              <button className="btn btn-outline">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security / Password */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-primary-500" /> Change Password
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
              <input type="password" className="input w-full" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
              <input type="password" className="input w-full" placeholder="••••••••" />
              <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-warning-500 w-2/3"></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">Good strength. Use letters, numbers, and symbols.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input type="password" className="input w-full" placeholder="••••••••" />
            </div>
            <button className="btn btn-primary w-full mt-2">Update Password</button>
          </div>
        </div>

        {/* Preferences */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary-500" /> Notification Preferences
          </h3>
          <div className="space-y-5">
            <Toggle 
              enabled={preferences.emailNotifications} 
              onChange={() => handleToggle('emailNotifications')}
              label={<span className="text-sm font-medium text-slate-700 ml-3">Email notifications</span>}
            />
            <Toggle 
              enabled={preferences.pushNotifications} 
              onChange={() => handleToggle('pushNotifications')}
              label={<span className="text-sm font-medium text-slate-700 ml-3">Push notifications</span>}
            />
            <div className="w-full h-px bg-slate-100 my-2"></div>
            <Toggle 
              enabled={preferences.sessionReminders} 
              onChange={() => handleToggle('sessionReminders')}
              label={
                <div className="flex flex-col ml-3">
                  <span className="text-sm font-medium text-slate-700">Session reminders</span>
                  <span className="text-xs text-slate-500">15 mins before class starts</span>
                </div>
              }
            />
            <Toggle 
              enabled={preferences.flaggedAlerts} 
              onChange={() => handleToggle('flaggedAlerts')}
              label={
                <div className="flex flex-col ml-3">
                  <span className="text-sm font-medium text-slate-700">Flagged attempt alerts</span>
                  <span className="text-xs text-slate-500">Immediate alert for proxy attempts</span>
                </div>
              }
            />
            <Toggle 
              enabled={preferences.weeklyReports} 
              onChange={() => handleToggle('weeklyReports')}
              label={
                <div className="flex flex-col ml-3">
                  <span className="text-sm font-medium text-slate-700">Weekly reports</span>
                  <span className="text-xs text-slate-500">Attendance summary every Friday</span>
                </div>
              }
            />
          </div>
        </div>
      </div>

      <div className="card border-danger-200 bg-danger-50/30 p-6 mt-6">
        <h3 className="text-lg font-bold text-danger-700 flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5" /> Danger Zone
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Deactivating your account will disable your access to the portal. Contact administration to restore access.
        </p>
        <button className="btn btn-danger">Deactivate Account</button>
      </div>
    </div>
  );
}
