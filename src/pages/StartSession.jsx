import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Play, Square, Clock, Users, BookOpen, MapPin, CheckCircle, AlertTriangle, Clock3 } from 'lucide-react';
import { classes, generateLiveAttendance, ATTENDANCE_STATUS } from '../data/mockData';
import { StatusBadge, Avatar } from '../components/ui/SharedComponents';

const StartSession = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const classDetails = classes?.find(c => c.id === classId) || {
    id: classId,
    subject: 'Unknown Subject',
    section: 'A',
    room: 'Unknown Room',
    studentsCount: 0
  };

  const [sessionActive, setSessionActive] = useState(false);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [attendanceList, setAttendanceList] = useState([]);
  const [sessionCode, setSessionCode] = useState('');
  
  const timerRef = useRef(null);
  const simulationRef = useRef(null);
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const openSession = () => {
    setSessionActive(true);
    setSessionClosed(false);
    setSessionCode(Math.random().toString(36).substring(2, 8).toUpperCase());
    setSessionTimer(0);
    setAttendanceList([]);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setSessionTimer(prev => prev + 1);
    }, 1000);
    
    // Start simulation
    const mockStudents = generateLiveAttendance(classId);
    let index = 0;
    simulationRef.current = setInterval(() => {
      if (index < mockStudents.length) {
        setAttendanceList(prev => [mockStudents[index], ...prev]);
        index++;
      } else {
        clearInterval(simulationRef.current);
      }
    }, 2500);
  };
  
  const closeSession = () => {
    setSessionActive(false);
    setSessionClosed(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (simulationRef.current) clearInterval(simulationRef.current);
  };
  
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, []);

  const presentCount = attendanceList.filter(s => s.status === ATTENDANCE_STATUS.PRESENT).length;
  const flaggedCount = attendanceList.filter(s => s.status === ATTENDANCE_STATUS.FLAGGED).length;
  const pendingCount = classDetails.studentsCount - presentCount - flaggedCount;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Class Details Header */}
      <div className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">{classDetails.subject}</h1>
          <p className="text-surface-500">Section {classDetails.section}</p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-surface-700 bg-surface-50 px-3 py-1.5 rounded-lg border border-surface-200">
            <BookOpen className="w-5 h-5 text-primary-500" />
            <span className="font-medium">{classDetails.id}</span>
          </div>
          <div className="flex items-center gap-2 text-surface-700 bg-surface-50 px-3 py-1.5 rounded-lg border border-surface-200">
            <MapPin className="w-5 h-5 text-primary-500" />
            <span className="font-medium">{classDetails.room}</span>
          </div>
          <div className="flex items-center gap-2 text-surface-700 bg-surface-50 px-3 py-1.5 rounded-lg border border-surface-200">
            <Users className="w-5 h-5 text-primary-500" />
            <span className="font-medium">{classDetails.studentsCount} Expected</span>
          </div>
        </div>
      </div>

      {!sessionActive && !sessionClosed && (
        <div className="card p-12 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-success-50 rounded-full flex items-center justify-center">
            <Play className="w-10 h-10 text-success-500 ml-1" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-surface-900 mb-2">Ready to take attendance?</h2>
            <p className="text-surface-500 max-w-md">Opening the attendance window will generate a session code and QR code for students to scan.</p>
          </div>
          <button onClick={openSession} className="btn-success btn-lg flex items-center gap-2">
            <Play className="w-5 h-5" />
            Open Attendance Window
          </button>
        </div>
      )}

      {sessionActive && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Active Session Info Sidebar */}
          <div className="space-y-6">
            <div className="card p-6 text-center border-t-4 border-t-success-500 relative overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="live-dot"></span>
                <span className="text-xs font-semibold text-success-600 uppercase tracking-wider">Live</span>
              </div>
              <h3 className="text-lg font-semibold text-surface-700 mb-2">Session Timer</h3>
              <div className="text-5xl font-bold text-surface-900 font-mono mb-6">
                {formatTime(sessionTimer)}
              </div>
              
              <div className="p-4 bg-surface-50 rounded-xl mb-6">
                <p className="text-sm font-medium text-surface-500 mb-1">Session Code</p>
                <div className="text-3xl font-bold tracking-[0.2em] text-primary-600">
                  {sessionCode}
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-surface-100">
                  <QRCodeSVG value={sessionCode} size={150} />
                </div>
              </div>

              <button onClick={closeSession} className="btn-danger w-full flex items-center justify-center gap-2">
                <Square className="w-5 h-5" />
                Close Session
              </button>
            </div>

            {/* Live Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-surface-700 mb-4">Live Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-success-50 rounded-lg text-success-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Present</span>
                  </div>
                  <span className="text-xl font-bold">{presentCount}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-danger-50 rounded-lg text-danger-700">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Flagged</span>
                  </div>
                  <span className="text-xl font-bold">{flaggedCount}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-50 rounded-lg text-surface-700">
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-5 h-5" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <span className="text-xl font-bold">{Math.max(0, pendingCount)}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-100">
                <button 
                  onClick={() => navigate(`/monitoring/${classId}`)}
                  className="btn-outline w-full"
                >
                  Go to Map View
                </button>
              </div>
            </div>
          </div>

          {/* Live Student List */}
          <div className="lg:col-span-2">
            <div className="card h-full flex flex-col">
              <div className="p-4 border-b border-surface-100 flex justify-between items-center bg-surface-50/50">
                <h3 className="font-semibold text-surface-900">Live Attendance Feed</h3>
                <span className="text-sm text-surface-500">{attendanceList.length} recent entries</span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                {attendanceList.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-surface-400 space-y-3">
                    <Clock className="w-8 h-8 animate-pulse-soft" />
                    <p>Waiting for students to check in...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attendanceList.map((student, idx) => (
                      <div 
                        key={student.id + idx} 
                        className={`flex items-center justify-between p-4 rounded-xl border animate-row-appear ${
                          student.status === ATTENDANCE_STATUS.PRESENT ? 'bg-success-50/30 border-success-100' :
                          student.status === ATTENDANCE_STATUS.FLAGGED ? 'bg-danger-50/30 border-danger-100' :
                          'bg-surface-50 border-surface-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar name={student.name} src={student.avatar} />
                          <div>
                            <p className="font-medium text-surface-900">{student.name}</p>
                            <p className="text-sm text-surface-500">{student.rollNo}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            {student.status === ATTENDANCE_STATUS.PRESENT && (
                              <p className="text-sm font-medium text-success-600 text-xs">
                                Match: {(student.confidence || 94.2).toFixed(1)}%
                              </p>
                            )}
                            {student.status === ATTENDANCE_STATUS.FLAGGED && (
                              <p className="text-sm font-medium text-danger-600 text-xs">
                                {student.flagReason || 'GPS Mismatch'}
                              </p>
                            )}
                            <p className="text-xs text-surface-400">
                              {student.timestamp ? student.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </p>
                          </div>
                          <StatusBadge status={student.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {sessionClosed && (
        <div className="card p-8 max-w-2xl mx-auto animate-scale-in text-center">
          <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-surface-600" />
          </div>
          <h2 className="text-2xl font-bold text-surface-900 mb-2">Session Completed</h2>
          <p className="text-surface-500 mb-8">Attendance window was open for {formatTime(sessionTimer)}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-success-50 rounded-xl border border-success-100">
              <p className="text-sm text-success-700 font-medium mb-1">Present</p>
              <p className="text-3xl font-bold text-success-700">{presentCount}</p>
            </div>
            <div className="p-4 bg-danger-50 rounded-xl border border-danger-100">
              <p className="text-sm text-danger-700 font-medium mb-1">Flagged</p>
              <p className="text-3xl font-bold text-danger-700">{flaggedCount}</p>
            </div>
            <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
              <p className="text-sm text-surface-700 font-medium mb-1">Absent</p>
              <p className="text-3xl font-bold text-surface-700">{Math.max(0, pendingCount)}</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/dashboard')} className="btn-outline">
              Back to Dashboard
            </button>
            <button onClick={() => navigate(`/reports/${classId}`)} className="btn-primary">
              View Detailed Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartSession;
