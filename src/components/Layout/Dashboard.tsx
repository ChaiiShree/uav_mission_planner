import { useState } from 'react';
import { DroneMap } from '../Map/DroneMap';
import { TelemetryPanel } from '../Telemetry/TelemetryPanel';
import { SerialMonitor } from '../SerialMonitor/SerialMonitor';
import { useTelemetry } from '../../hooks/useTelemetry';
import { Menu, X, MapPin, Target, Shield, Radio, Terminal, Code } from 'lucide-react';

export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [serialMonitorOpen, setSerialMonitorOpen] = useState(false);
  
  const {
    telemetry,
    waypoints,
    droneStatus,
    isConnected,
    addWaypoint,
    removeWaypoint
  } = useTelemetry();

  return (
    <div className="h-screen flex bg-gray-900 grid-overlay">
      {/* Tactical Sidebar */}
      <div className={`
        ${sidebarOpen ? 'w-85' : 'w-0'} 
        transition-all duration-300 overflow-hidden z-10
        md:relative absolute h-full
      `}>
        <TelemetryPanel telemetry={telemetry} droneStatus={droneStatus} />
      </div>

      {/* Main Command Interface */}
      <div className="flex-1 flex flex-col">
        {/* Command Header */}
        <div className="command-header p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="command-btn p-2 rounded"
              >
                <Menu size={20} />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 border border-green-500 rounded">
                <Target className="text-green-400" size={20} />
              </div>
              <div>
                <h1 className="military-heading text-xl">
                  UAV COMMAND CENTER
                </h1>
                <p className="text-xs text-gray-500 font-mono">MISSION CONTROL SYSTEM</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Network Status */}
            <div className="tactical-card px-3 py-2 rounded flex items-center gap-2">
              <div className={`status-indicator w-2 h-2 rounded-full ${
                isConnected ? 'status-online' : 'status-offline'
              }`} />
              <Radio size={14} className={isConnected ? 'text-green-400' : 'text-red-400'} />
              <span className="font-mono text-xs">
                {isConnected ? 'TELEMETRY' : 'NO SIGNAL'}
              </span>
            </div>
            
            {/* Waypoint Counter */}
            <div className="tactical-card px-3 py-2 rounded flex items-center gap-2">
              <MapPin size={14} className="text-yellow-500" />
              <span className="font-mono text-xs">
                WP: {waypoints.length.toString().padStart(2, '0')}
              </span>
            </div>

            {/* Armed Status */}
            <div className="tactical-card px-3 py-2 rounded flex items-center gap-2">
              <Shield size={14} className={droneStatus.armed ? 'text-red-400' : 'text-green-400'} />
              <span className={`font-mono text-xs ${droneStatus.armed ? 'text-red-400' : 'text-green-400'}`}>
                {droneStatus.armed ? 'ARMED' : 'SAFE'}
              </span>
            </div>

            {/* Serial Monitor Toggle */}
            <button
              onClick={() => setSerialMonitorOpen(!serialMonitorOpen)}
              className={`tactical-card px-3 py-2 rounded flex items-center gap-2 transition-colors ${
                serialMonitorOpen ? 'bg-green-700 text-green-200' : 'hover:bg-gray-600'
              }`}
              title="Toggle Serial Monitor"
            >
              <Terminal size={14} />
              <span className="font-mono text-xs hidden md:inline">CONSOLE</span>
            </button>
          </div>
        </div>

        {/* Map Display */}
        <div className={`flex-1 p-4 transition-all ${serialMonitorOpen ? 'pb-[400px]' : ''}`}>
          <div className="tactical-map h-full relative">
            <DroneMap
              telemetry={telemetry}
              waypoints={waypoints}
              isConnected={droneStatus.connected}
              onAddWaypoint={addWaypoint}
              onRemoveWaypoint={removeWaypoint}
            />
            
            {/* Enhanced Tactical Overlay */}
            <div className="absolute top-4 right-4 tactical-overlay-card">
              <div className="tactical-overlay-header">
                <MapPin size={16} className="text-blue-400" />
                <span className="tactical-overlay-title">MAP CONTROLS</span>
              </div>
              
              <div className="tactical-overlay-content">
                <div className="tactical-overlay-section">
                  <div className="tactical-overlay-item">
                    <span className="tactical-overlay-key">DOUBLE-CLICK</span>
                    <span className="tactical-overlay-desc">ADD WAYPOINT</span>
                  </div>
                  <div className="tactical-overlay-item">
                    <span className="tactical-overlay-key">SCROLL</span>
                    <span className="tactical-overlay-desc">ZOOM IN/OUT</span>
                  </div>
                  <div className="tactical-overlay-item">
                    <span className="tactical-overlay-key">DRAG</span>
                    <span className="tactical-overlay-desc">PAN VIEW</span>
                  </div>
                </div>
                
                <div className="tactical-overlay-footer">
                  <div className="tactical-overlay-classification">
                    CLASSIFICATION: UNCLASSIFIED
                  </div>
                </div>
              </div>
            </div>

            {/* Serial Monitor Status Indicator */}
            {serialMonitorOpen && (
              <div className="absolute bottom-4 left-4 tactical-card p-3 rounded flex items-center gap-2">
                <Terminal size={16} className="text-green-400" />
                <span className="text-sm font-mono text-green-400 font-semibold">SERIAL CONSOLE ACTIVE</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 z-0"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Serial Monitor Component */}
      <SerialMonitor 
        isOpen={serialMonitorOpen} 
        onToggle={() => setSerialMonitorOpen(!serialMonitorOpen)} 
      />
    </div>
  );
};
