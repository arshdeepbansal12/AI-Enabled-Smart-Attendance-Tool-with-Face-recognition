import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StartSession from './pages/StartSession';
import LiveMonitoring from './pages/LiveMonitoring';
import Reports from './pages/Reports';
import Students from './pages/Students';
import ClassSettings from './pages/ClassSettings';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Login onLogin={handleLogin} />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <AppLayout onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/session/:classId" element={<StartSession />} />
          <Route path="/monitoring/:classId" element={<LiveMonitoring />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/students" element={<Students />} />
          <Route path="/settings" element={<ClassSettings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
