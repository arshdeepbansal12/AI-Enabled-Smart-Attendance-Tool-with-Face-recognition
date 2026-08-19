import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Users, ChevronRight, Activity, CalendarCheck, BookOpen, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { StatCard } from '../components/ui/SharedComponents';
import { teacher, classes, dashboardStats } from '../data/mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeClass = classes.find(c => c.status === 'in-progress' || c.status === 'upcoming');
  const todaysClasses = classes;

  return (
    <div className="animate-fade-in p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl page-header pb-1">
            Good Morning, Mr. Arjun Mehta
          </h1>
          <p className="text-surface-500 mt-1 font-medium">
            {format(currentTime, 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        
        <div className="card glass-card px-4 py-3 flex items-center gap-3 animate-slide-up shadow-sm">
          <Clock className="w-5 h-5 text-primary-500" />
          <span className="text-lg font-mono font-bold text-surface-800">
            {format(currentTime, 'hh:mm:ss a')}
          </span>
        </div>
      </div>

      {/* Active Session Banner */}
      {activeClass && (
        <div className="card-interactive bg-white border-l-4 border-l-primary-500 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="live-dot"></span>
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">
                {activeClass.status === 'in-progress' ? 'Active Session' : 'Next Class'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-surface-900">{activeClass.subject}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-surface-600">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {activeClass.time}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {activeClass.room}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4"/> {activeClass.expectedStudents} Students</span>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/session/${activeClass.id}`)}
            className="btn-primary btn-lg w-full md:w-auto flex items-center justify-center gap-2"
          >
            {activeClass.status === 'in-progress' ? 'Resume Attendance' : 'Start Attendance'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={CalendarCheck} 
          title="Classes Today" 
          value={dashboardStats.classesToday} 
          trend={0} 
          color="primary" 
          delay={200} 
        />
        <StatCard 
          icon={Activity} 
          title="Avg Attendance" 
          value={`${dashboardStats.averageAttendance}%`} 
          trend={dashboardStats.attendanceTrend} 
          trendLabel="vs last week"
          color="success" 
          delay={300} 
        />
        <StatCard 
          icon={BookOpen} 
          title="Total Students" 
          value={dashboardStats.totalStudents} 
          trend={0} 
          color="primary" 
          delay={400} 
        />
        <StatCard 
          icon={AlertTriangle} 
          title="Flagged" 
          value={dashboardStats.flaggedStudents} 
          trend={0} 
          trendLabel="needs review"
          color="warning" 
          delay={500} 
        />
      </div>

      {/* My Classes Today */}
      <div>
        <h3 className="text-xl font-bold text-surface-900 mb-4 flex items-center gap-2">
          My Classes Today
        </h3>
        
        {todaysClasses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {todaysClasses.map((cls, index) => (
              <div 
                key={cls.id} 
                className="card flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-l-4 hover:border-l-primary-500 animate-slide-up"
                style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}
              >
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg text-surface-900 line-clamp-1" title={cls.subject}>
                      {cls.subject}
                    </h4>
                    <span className="text-xs font-bold px-2 py-1 bg-surface-100 text-surface-600 rounded-md">
                      {cls.code}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-surface-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-surface-400" /> {cls.time}
                    </p>
                    <p className="text-sm text-surface-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-surface-400" /> {cls.room}
                    </p>
                    <p className="text-sm text-surface-600 flex items-center gap-2">
                      <Users className="w-4 h-4 text-surface-400" /> {cls.expectedStudents} Students
                      <span className="ml-auto text-xs bg-surface-100 px-1.5 py-0.5 rounded text-surface-500">Sec {cls.section}</span>
                    </p>
                  </div>
                </div>
                
                <div className="p-4 border-t border-surface-100 bg-surface-50/50 mt-auto">
                  <button 
                    onClick={() => navigate(`/session/${cls.id}`)}
                    className="w-full btn-primary btn-sm justify-center bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 border-0"
                  >
                    {cls.status === 'completed' ? 'View Report' : 'Start Attendance'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center flex flex-col items-center justify-center text-surface-500">
            <BookOpen className="w-12 h-12 mb-3 text-surface-300" />
            <h3 className="text-lg font-medium text-surface-700">No classes scheduled</h3>
            <p>You don't have any classes for today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
