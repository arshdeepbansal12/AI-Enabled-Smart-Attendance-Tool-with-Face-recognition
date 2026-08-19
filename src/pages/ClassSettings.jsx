import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Clock, Shield, Wifi, Smartphone, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { classSettings } from '../data/mockData';
import { Toggle } from '../components/ui/SharedComponents';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition([pos.lat, pos.lng]);
        },
      }}
    />
  );
}

function ClassSettingCard({ cls }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState(cls);
  const [position, setPosition] = useState([cls.geofence.lat, cls.geofence.lng]);

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      antiProxy: {
        ...prev.antiProxy,
        [key]: !prev.antiProxy[key],
      },
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings for', settings.subject, { ...settings, geofence: { ...settings.geofence, lat: position[0], lng: position[1] } });
    alert('Settings saved successfully!');
  };

  return (
    <div className="card mb-4 overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="font-semibold text-slate-800 text-lg">{settings.subject}</h3>
          <p className="text-sm text-slate-500">
            {settings.code} • Section {settings.section} • Room {settings.room}
          </p>
        </div>
        <div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-slate-100 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Map & Geofence */}
            <div className="space-y-6">
              <div>
                <h4 className="flex items-center text-sm font-medium text-slate-700 mb-4">
                  <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                  Location & Geofence
                </h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Latitude</label>
                    <input 
                      type="number" 
                      className="input w-full" 
                      value={position[0]} 
                      onChange={(e) => setPosition([parseFloat(e.target.value), position[1]])}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Longitude</label>
                    <input 
                      type="number" 
                      className="input w-full" 
                      value={position[1]} 
                      onChange={(e) => setPosition([position[0], parseFloat(e.target.value)])}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Radius (meters)</span>
                    <span className="font-medium text-primary-600">{settings.geofence.radius}m</span>
                  </label>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="5"
                    className="w-full accent-primary-500" 
                    value={settings.geofence.radius}
                    onChange={(e) => setSettings({...settings, geofence: {...settings.geofence, radius: parseInt(e.target.value)}})}
                  />
                </div>

                <div className="h-[250px] rounded-lg overflow-hidden border border-slate-200">
                  <MapContainer 
                    center={position} 
                    zoom={17} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker position={position} setPosition={setPosition} />
                    <Circle 
                      center={position} 
                      radius={settings.geofence.radius} 
                      pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.2 }}
                    />
                  </MapContainer>
                </div>
              </div>
            </div>

            {/* Right Column: Settings & Security */}
            <div className="space-y-6">
              <div>
                <h4 className="flex items-center text-sm font-medium text-slate-700 mb-4">
                  <Clock className="w-4 h-4 mr-2 text-primary-500" />
                  Attendance Window
                </h4>
                <div>
                  <label className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Duration (minutes)</span>
                    <span className="font-medium text-primary-600">{settings.windowDuration} mins</span>
                  </label>
                  <input 
                    type="range" 
                    min="5" 
                    max="30" 
                    step="1"
                    className="w-full accent-primary-500" 
                    value={settings.windowDuration}
                    onChange={(e) => setSettings({...settings, windowDuration: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <h4 className="flex items-center text-sm font-medium text-slate-700 mb-4">
                  <Shield className="w-4 h-4 mr-2 text-primary-500" />
                  Anti-Proxy Settings
                </h4>
                <div className="space-y-4">
                  <Toggle 
                    enabled={settings.antiProxy.livenessRequired} 
                    onChange={() => handleToggle('livenessRequired')}
                    label={
                      <div className="flex flex-col ml-3">
                        <span className="text-sm font-medium text-slate-700">Liveness Detection</span>
                        <span className="text-xs text-slate-500">Require face blink/smile for verification</span>
                      </div>
                    }
                  />
                  <Toggle 
                    enabled={settings.antiProxy.deviceBinding} 
                    onChange={() => handleToggle('deviceBinding')}
                    label={
                      <div className="flex flex-col ml-3 flex-1">
                        <span className="text-sm font-medium text-slate-700 flex items-center gap-1"><Smartphone className="w-3 h-3"/> Device Binding</span>
                        <span className="text-xs text-slate-500">Lock attendance to student's registered device</span>
                      </div>
                    }
                  />
                  <Toggle 
                    enabled={settings.antiProxy.wifiCheck} 
                    onChange={() => handleToggle('wifiCheck')}
                    label={
                      <div className="flex flex-col ml-3 flex-1">
                        <span className="text-sm font-medium text-slate-700 flex items-center gap-1"><Wifi className="w-3 h-3"/> Wi-Fi Check</span>
                        <span className="text-xs text-slate-500">Require connection to specific campus network</span>
                      </div>
                    }
                  />
                  
                  {settings.antiProxy.wifiCheck && (
                    <div className="ml-12 mt-2">
                      <label className="block text-xs text-slate-500 mb-1">Target SSID</label>
                      <input 
                        type="text" 
                        className="input w-full text-sm" 
                        value={settings.antiProxy.allowedSSID}
                        onChange={(e) => setSettings({...settings, antiProxy: {...settings.antiProxy, allowedSSID: e.target.value}})}
                        placeholder="e.g. Campus-Secure"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="btn btn-primary flex items-center gap-2" onClick={handleSave}>
                  <Save className="w-4 h-4" /> Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClassSettings() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Class Settings</h1>
        <p className="text-slate-500 mt-1">Configure geofences and anti-proxy rules for your classes.</p>
      </div>

      <div className="space-y-4">
        {classSettings.map((cls) => (
          <ClassSettingCard key={cls.id} cls={cls} />
        ))}
      </div>
    </div>
  );
}
