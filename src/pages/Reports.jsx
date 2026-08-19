import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FileDown, Filter, Search, TrendingUp, Award, AlertTriangle, BookOpen, ChevronDown } from 'lucide-react';
import { classes, attendanceHistory, generateStudentAttendanceSummary } from '../data/mockData';
import { StatCard, StatusBadge, Avatar } from '../components/ui/SharedComponents';

export default function Reports() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stats
  const totalSessions = 124;
  const avgAttendance = 82;
  const classesBelow75 = 2;
  const bestClass = 'CS101';

  // Format attendance trend data
  const trendData = attendanceHistory.slice(0, 7).reverse().map(record => ({
    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'CS101': 70 + Math.random() * 25,
    'CS202': 75 + Math.random() * 20,
    'EE301': 80 + Math.random() * 15,
  }));

  const barData = classes.map(c => ({
    name: c.id,
    attendance: Math.floor(75 + Math.random() * 20)
  }));
  
  const studentSummary = selectedClass === 'all' 
    ? generateStudentAttendanceSummary(classes[0].id) // default to first class
    : generateStudentAttendanceSummary(selectedClass);

  const filteredStudents = studentSummary.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Reports & Analytics</h1>
          <p className="text-surface-500">View attendance history and performance metrics.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline">
            <FileDown size={18} />
            Export CSV
          </button>
          <button className="btn btn-outline">
            <FileDown size={18} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="card p-4 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-surface-700 mb-1">Class</label>
          <select 
            className="select w-full"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="all">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
            ))}
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-surface-700 mb-1">Date Range</label>
          <div className="flex gap-2">
            <input type="date" className="input w-full" />
            <input type="date" className="input w-full" />
          </div>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-surface-700 mb-1">Student Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or roll no..." 
              className="input w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary h-[42px]">
          <Filter size={18} />
          Apply
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard 
          icon={BookOpen} 
          title="Total Sessions" 
          value={totalSessions} 
          color="text-primary-500" 
        />
        <StatCard 
          icon={TrendingUp} 
          title="Avg Attendance" 
          value={`${avgAttendance}%`} 
          color="text-success-500" 
        />
        <StatCard 
          icon={AlertTriangle} 
          title="Classes Below 75%" 
          value={classesBelow75} 
          color="text-danger-500" 
        />
        <StatCard 
          icon={Award} 
          title="Best Performing Class" 
          value={bestClass} 
          color="text-warning-500" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Attendance Trend — Last 30 Days</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="CS101" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="CS202" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="EE301" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card p-5">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Attendance by Class</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="attendance" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Per-Student Attendance Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-surface-200 flex justify-between items-center bg-surface-50">
          <h3 className="text-lg font-semibold text-surface-900">Per-Student Attendance</h3>
          <select 
            className="select max-w-xs bg-white"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 text-surface-500 text-sm border-b border-surface-200">
                <th className="px-6 py-3 font-medium">Student</th>
                <th className="px-6 py-3 font-medium">Roll No</th>
                <th className="px-6 py-3 font-medium">Attended/Total</th>
                <th className="px-6 py-3 font-medium">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => {
                  const percentage = (student.attended / student.totalClasses) * 100;
                  const isWarning = percentage < 75;
                  
                  return (
                    <tr key={student.id} className={`hover:bg-surface-50 transition-colors ${isWarning ? 'bg-danger-50 hover:bg-danger-100/50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={student.name} size="sm" />
                          <span className="font-medium text-surface-900">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-surface-600">{student.rollNo}</td>
                      <td className="px-6 py-4 text-surface-600">{student.attended} / {student.totalClasses}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={percentage >= 85 ? 'present' : percentage >= 75 ? 'pending' : 'absent'}>
                          {percentage.toFixed(1)}%
                        </StatusBadge>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-surface-500">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Attendance Records Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-surface-200 bg-surface-50">
          <h3 className="text-lg font-semibold text-surface-900">Recent Class Sessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 text-surface-500 text-sm border-b border-surface-200">
                <th className="px-6 py-3 font-medium">Date & Time</th>
                <th className="px-6 py-3 font-medium">Class</th>
                <th className="px-6 py-3 font-medium">Present/Total</th>
                <th className="px-6 py-3 font-medium">Percentage</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {attendanceHistory.slice(0, 10).map((record, i) => {
                const percentage = (record.present / record.totalStudents) * 100;
                return (
                  <tr key={i} className="hover:bg-surface-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-surface-900 font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-surface-500">{record.startTime} - {record.endTime}</div>
                    </td>
                    <td className="px-6 py-4 text-surface-600">{record.classId}</td>
                    <td className="px-6 py-4 text-surface-600">{record.present} / {record.totalStudents}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${percentage >= 85 ? 'text-success-600' : percentage >= 75 ? 'text-warning-600' : 'text-danger-600'}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="btn btn-sm btn-ghost text-primary-600 hover:text-primary-700">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
