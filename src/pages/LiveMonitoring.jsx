import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Check, X, AlertTriangle, ArrowUpDown, ChevronDown } from 'lucide-react';
import { classes, generateLiveAttendance, ATTENDANCE_STATUS } from '../data/mockData';
import { StatusBadge, Avatar, Modal } from '../components/ui/SharedComponents';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createColoredIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const iconGreen = createColoredIcon('green');
const iconRed = createColoredIcon('red');
const iconBlue = createColoredIcon('blue');

const LiveMonitoring = () => {
  const { classId } = useParams();
  const classDetails = classes?.find(c => c.id === classId) || {
    id: classId,
    subject: 'Unknown Subject',
    location: { lat: 11.0168, lng: 76.9558, radius: 50 } // default map location
  };
  
  const mapCenter = [classDetails.location?.lat || 11.0168, classDetails.location?.lng || 76.9558];
  const geoRadius = classDetails.location?.radius || 50;

  const [students, setStudents] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [overrideModal, setOverrideModal] = useState({ isOpen: false, student: null });
  const [overrideReason, setOverrideReason] = useState('verified');
  
  const simulationRef = useRef(null);

  useEffect(() => {
    // Start simulation
    const mockStudents = generateLiveAttendance(classId);
    let index = 0;
    simulationRef.current = setInterval(() => {
      if (index < mockStudents.length) {
        setStudents(prev => [mockStudents[index], ...prev]);
        index++;
      } else {
        clearInterval(simulationRef.current);
      }
    }, 2500);
    
    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [classId]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleOverride = (status) => {
    setStudents(prev => prev.map(s => {
      if (s.id === overrideModal.student.id) {
        return { ...s, status, flagReason: status === ATTENDANCE_STATUS.PRESENT ? `Manually Approved (${overrideReason})` : 'Manually Rejected' };
      }
      return s;
    }));
    setOverrideModal({ isOpen: false, student: null });
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto h-[calc(100vh-80px)] flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Live Monitoring - {classDetails.subject}</h1>
          <p className="text-surface-500">Real-time attendance & GPS tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="live-dot"></span>
          <span className="text-sm font-semibold text-success-600 uppercase">System Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left Side: Table */}
        <div className="card flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-surface-100 bg-surface-50">
            <h2 className="font-semibold text-surface-800">Recent Checks ({students.length})</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-surface-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="p-4 font-medium text-surface-500 text-sm">Student</th>
                  <th className="p-4 font-medium text-surface-500 text-sm cursor-pointer hover:bg-surface-100 transition-colors" onClick={() => handleSort('timestamp')}>
                    <div className="flex items-center gap-1">Time Marked <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4 font-medium text-surface-500 text-sm cursor-pointer hover:bg-surface-100 transition-colors" onClick={() => handleSort('gpsDistance')}>
                    <div className="flex items-center gap-1">GPS Distance <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4 font-medium text-surface-500 text-sm cursor-pointer hover:bg-surface-100 transition-colors" onClick={() => handleSort('confidence')}>
                    <div className="flex items-center gap-1">Face Match <ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="p-4 font-medium text-surface-500 text-sm">Status / Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, idx) => (
                  <tr key={student.id + idx} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors animate-row-appear">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.name} src={student.avatar} size="sm" />
                        <div>
                          <p className="font-medium text-surface-900">{student.name}</p>
                          <p className="text-xs text-surface-500">{student.rollNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-surface-700">{student.timestamp}</td>
                    <td className="p-4">
                      <span className={`text-sm font-medium ${student.gpsDistance > geoRadius ? 'text-danger-600' : 'text-success-600'}`}>
                        {student.gpsDistance || 0}m
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-surface-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${(student.confidence || 90) >= 80 ? 'bg-success-500' : 'bg-warning-500'}`} 
                            style={{ width: `${student.confidence || 90}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-surface-600">{(student.confidence || 90).toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {student.status === ATTENDANCE_STATUS.FLAGGED ? (
                        <div className="flex items-center gap-2">
                          <StatusBadge status={student.status} />
                          <button 
                            onClick={() => setOverrideModal({ isOpen: true, student })}
                            className="text-xs px-2 py-1 bg-surface-200 hover:bg-surface-300 text-surface-800 rounded transition-colors font-medium"
                          >
                            Review
                          </button>
                        </div>
                      ) : (
                        <StatusBadge status={student.status} />
                      )}
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-surface-500">
                      Waiting for attendance data...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Map */}
        <div className="card h-full overflow-hidden flex flex-col relative z-0">
          <div className="p-4 border-b border-surface-100 bg-surface-50 flex justify-between items-center z-10 relative">
            <h2 className="font-semibold text-surface-800">Geofence Map</h2>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-success-500 border border-success-600"></div> Present</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-danger-500 border border-danger-600"></div> Flagged</span>
            </div>
          </div>
          <div className="flex-1 relative z-0">
            <MapContainer center={mapCenter} zoom={18} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Circle 
                center={mapCenter} 
                radius={geoRadius} 
                pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.1 }} 
              />
              <Marker position={mapCenter} icon={iconBlue}>
                <Popup>
                  <strong>{classDetails.room || 'Classroom'}</strong><br/>Geofence Center
                </Popup>
              </Marker>
              
              {students.map((student, idx) => {
                if (!student.location) return null;
                const isFlagged = student.status === ATTENDANCE_STATUS.FLAGGED;
                return (
                  <Marker 
                    key={student.id + idx} 
                    position={[student.location.lat, student.location.lng]}
                    icon={isFlagged ? iconRed : iconGreen}
                  >
                    <Popup>
                      <div className="flex flex-col gap-1">
                        <strong>{student.name}</strong>
                        <span className="text-xs text-surface-500">{student.rollNo}</span>
                        <div className="mt-1">
                          <StatusBadge status={student.status} />
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={overrideModal.isOpen} 
        onClose={() => setOverrideModal({ isOpen: false, student: null })}
        title="Review Flagged Attendance"
        size="md"
      >
        {overrideModal.student && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-danger-50 rounded-lg border border-danger-100">
              <AlertTriangle className="w-8 h-8 text-danger-500" />
              <div>
                <h3 className="font-semibold text-danger-900">System Flag: {overrideModal.student.flagReason}</h3>
                <p className="text-sm text-danger-700">Please verify student presence manually.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 border border-surface-200 rounded-lg">
              <Avatar name={overrideModal.student.name} src={overrideModal.student.avatar} size="lg" />
              <div>
                <h4 className="font-bold text-surface-900">{overrideModal.student.name}</h4>
                <p className="text-surface-500">{overrideModal.student.rollNo}</p>
                <p className="text-sm text-surface-600 mt-1">Time: {overrideModal.student.timestamp}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Override Reason</label>
              <div className="relative">
                <select 
                  className="select w-full appearance-none pr-10"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                >
                  <option value="verified">Visually Verified in Class</option>
                  <option value="device_issue">Known Device/Network Issue</option>
                  <option value="late">Late Arrival Approved</option>
                  <option value="other">Other Valid Reason</option>
                </select>
                <ChevronDown className="w-5 h-5 text-surface-500 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-surface-100">
              <button 
                className="btn-success flex-1 flex justify-center items-center gap-2"
                onClick={() => handleOverride(ATTENDANCE_STATUS.PRESENT)}
              >
                <Check className="w-4 h-4" /> Approve Attendance
              </button>
              <button 
                className="btn-danger flex-1 flex justify-center items-center gap-2"
                onClick={() => handleOverride(ATTENDANCE_STATUS.ABSENT)}
              >
                <X className="w-4 h-4" /> Mark Absent
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LiveMonitoring;
