// ============================================================
// MOCK DATA — Teacher Portal, AI Smart Attendance System
// ============================================================

// ---------- Teacher ----------
export const teacher = {
  id: 'T-1001',
  name: 'Mr. Arjun Mehta',
  email: 'arjun.mehta@university.edu',
  department: 'Computer Science & Engineering',
  employeeId: 'EMP-2024-0451',
  avatar: null, // placeholder
  phone: '+91 98765 43210',
  designation: 'Assistant Professor',
};

// ---------- Students (pool) ----------
const firstNames = [
  'Aarav','Aditi','Aditya','Ananya','Arjun','Diya','Ishaan','Kavya','Krishna',
  'Meera','Neha','Nikhil','Pooja','Rahul','Riya','Rohan','Sakshi','Sanjay',
  'Shreya','Tanvi','Varun','Vihaan','Yash','Zara','Aisha','Arnav','Dev',
  'Esha','Gaurav','Harsh','Ira','Jai','Karan','Lavanya','Manav','Nisha',
  'Om','Prachi','Raj','Simran','Tara','Ujjwal','Vedika','Waris','Yashika',
];
const lastNames = [
  'Agarwal','Bansal','Chauhan','Desai','Gupta','Joshi','Kapoor','Kumar',
  'Malhotra','Nair','Pandey','Rao','Reddy','Shah','Sharma','Singh',
  'Srivastava','Tiwari','Verma','Yadav',
];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateStudents = (classId, count) => {
  const students = [];
  const usedNames = new Set();
  for (let i = 1; i <= count; i++) {
    let name;
    do {
      name = `${randomFrom(firstNames)} ${randomFrom(lastNames)}`;
    } while (usedNames.has(name));
    usedNames.add(name);
    students.push({
      id: `${classId}-S${String(i).padStart(3, '0')}`,
      rollNo: `${classId.replace('CLS-', '')}${String(i).padStart(3, '0')}`,
      name,
      email: `${name.toLowerCase().replace(/ /g, '.')}@student.university.edu`,
      faceEnrolled: Math.random() > 0.15,
      avatar: null,
    });
  }
  return students;
};

// ---------- Classes ----------
export const classes = [
  {
    id: 'CLS-CS301',
    subject: 'Data Structures & Algorithms',
    name: 'Data Structures & Algorithms',
    code: 'CS301',
    section: 'A',
    room: 'LH-204',
    time: '09:00 AM – 10:00 AM',
    startHour: 9,
    expectedStudents: 42,
    semester: '3rd',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    geofenceRadius: 50,
  },
  {
    id: 'CLS-CS402',
    subject: 'Database Management Systems',
    name: 'Database Management Systems',
    code: 'CS402',
    section: 'B',
    room: 'LH-301',
    time: '11:00 AM – 12:00 PM',
    startHour: 11,
    expectedStudents: 38,
    semester: '4th',
    coordinates: { lat: 28.6145, lng: 77.2095 },
    geofenceRadius: 50,
  },
  {
    id: 'CLS-CS501',
    subject: 'Computer Networks',
    name: 'Computer Networks',
    code: 'CS501',
    section: 'A',
    room: 'LH-105',
    time: '02:00 PM – 03:00 PM',
    startHour: 14,
    expectedStudents: 45,
    semester: '5th',
    coordinates: { lat: 28.6150, lng: 77.2085 },
    geofenceRadius: 45,
  },
  {
    id: 'CLS-CS601',
    subject: 'Artificial Intelligence & ML',
    name: 'Artificial Intelligence & ML',
    code: 'CS601',
    section: 'A',
    room: 'Smart Lab-2',
    time: '04:00 PM – 05:30 PM',
    startHour: 16,
    expectedStudents: 35,
    semester: '6th',
    coordinates: { lat: 28.6142, lng: 77.2088 },
    geofenceRadius: 40,
  },
];

// Generate students for each class
export const studentsByClass = {};
classes.forEach((cls) => {
  studentsByClass[cls.id] = generateStudents(cls.id, cls.expectedStudents);
});

// Flat list of all students
export const allStudents = Object.values(studentsByClass).flat();

// ---------- Attendance statuses ----------
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  PENDING: 'pending',
  ABSENT: 'absent',
  FLAGGED: 'flagged',
};

const flagReasons = [
  'Outside geofence',
  'Face mismatch',
  'Liveness check failed',
  'GPS spoofing detected',
  'Device not registered',
];

// Generate a live-session attendance list for a class
export const generateLiveAttendance = (classId) => {
  const students = studentsByClass[classId] || [];
  return students.map((s, idx) => {
    const rand = Math.random();
    let status, timestamp, matchScore, gpsDistance, reason;

    if (idx < students.length * 0.65) {
      status = ATTENDANCE_STATUS.PRESENT;
      timestamp = new Date(Date.now() - Math.random() * 30 * 60 * 1000);
      matchScore = (85 + Math.random() * 15).toFixed(1);
      gpsDistance = (Math.random() * 30).toFixed(0);
      reason = null;
    } else if (rand < 0.5) {
      status = ATTENDANCE_STATUS.PENDING;
      timestamp = null;
      matchScore = null;
      gpsDistance = null;
      reason = null;
    } else {
      status = ATTENDANCE_STATUS.FLAGGED;
      timestamp = new Date(Date.now() - Math.random() * 20 * 60 * 1000);
      matchScore = (30 + Math.random() * 40).toFixed(1);
      gpsDistance = (50 + Math.random() * 200).toFixed(0);
      reason = randomFrom(flagReasons);
    }
    return {
      ...s,
      status,
      timestamp,
      matchScore: matchScore ? parseFloat(matchScore) : null,
      gpsDistance: gpsDistance ? parseInt(gpsDistance) : null,
      reason,
      gpsCoords: status !== ATTENDANCE_STATUS.PENDING
        ? {
            lat: 28.6139 + (Math.random() - 0.5) * 0.003,
            lng: 77.2090 + (Math.random() - 0.5) * 0.003,
          }
        : null,
    };
  });
};

// ---------- Historical attendance (30 days) ----------
export const generateAttendanceHistory = () => {
  const history = [];
  for (let d = 29; d >= 0; d--) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split('T')[0];
    classes.forEach((cls) => {
      const present = Math.floor(cls.expectedStudents * (0.65 + Math.random() * 0.3));
      history.push({
        date: dateStr,
        classId: cls.id,
        className: cls.subject,
        classCode: cls.code,
        totalStudents: cls.expectedStudents,
        present,
        absent: cls.expectedStudents - present,
        percentage: parseFloat(((present / cls.expectedStudents) * 100).toFixed(1)),
      });
    });
  }
  return history;
};

export const attendanceHistory = generateAttendanceHistory();

// Per-student attendance summary
export const generateStudentAttendanceSummary = (classId) => {
  const students = studentsByClass[classId] || [];
  return students.map((s) => {
    const totalClasses = 30;
    const attended = Math.floor(totalClasses * (0.5 + Math.random() * 0.5));
    return {
      ...s,
      totalClasses,
      attended,
      percentage: parseFloat(((attended / totalClasses) * 100).toFixed(1)),
    };
  });
};

// ---------- Notifications ----------
export const notifications = [
  {
    id: 'N-001',
    type: 'critical',
    title: 'Proxy Attempt Detected',
    message: 'Rahul Kumar (CS301-012) attempted attendance from 2.3 km away. GPS spoofing suspected.',
    time: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    category: 'flagged',
  },
  {
    id: 'N-002',
    type: 'warning',
    title: 'Face Mismatch Alert',
    message: 'Ananya Gupta (CS402-008) — face match score 34.2%. Manual review recommended.',
    time: new Date(Date.now() - 45 * 60 * 1000),
    read: false,
    category: 'flagged',
  },
  {
    id: 'N-003',
    type: 'warning',
    title: 'Liveness Check Failed',
    message: 'Varun Desai (CS501-021) failed liveness check. Photo of photo detected.',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    category: 'flagged',
  },
  {
    id: 'N-004',
    type: 'info',
    title: 'Session Summary',
    message: 'CS301 (Data Structures) session completed. 38/42 students marked present.',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
    category: 'system',
  },
  {
    id: 'N-005',
    type: 'info',
    title: 'Enrollment Reminder',
    message: '6 students in CS601 have not completed face enrollment. Send reminder?',
    time: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: true,
    category: 'system',
  },
  {
    id: 'N-006',
    type: 'critical',
    title: 'Multiple Failed Attempts',
    message: 'Aarav Singh (CS301-005) has 3 failed attendance attempts in last 24 hours.',
    time: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    category: 'flagged',
  },
  {
    id: 'N-007',
    type: 'info',
    title: 'System Update',
    message: 'Face recognition model updated to v2.4. Accuracy improved by 3.2%.',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    category: 'system',
  },
  {
    id: 'N-008',
    type: 'warning',
    title: 'Low Attendance Alert',
    message: 'CS501 (Computer Networks) average attendance dropped below 75% this week.',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    category: 'system',
  },
];

// ---------- Dashboard Stats ----------
export const dashboardStats = {
  totalClassesToday: 4,
  totalStudents: 160,
  averageAttendance: 87.3,
  activeSessions: 1,
};

// ---------- Geofence / Class settings ----------
export const classSettings = classes.map((cls) => ({
  ...cls,
  attendanceWindowMinutes: 15,
  livenessRequired: true,
  deviceBindingRequired: false,
  wifiCheckRequired: true,
  allowedWifiSSID: 'University-Secure',
}));
