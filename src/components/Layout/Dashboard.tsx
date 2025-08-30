import { useState } from 'react';
import { DroneMap } from '../Map/DroneMap';
import { TelemetryPanel } from '../Telemetry/TelemetryPanel';
import { useTelemetry } from '../../hooks/useTelemetry';
import { Menu, X, MapPin, Target, Shield, Radio } from 'lucide-react';

export const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
        ${sidebarOpen ? 'w-80' : 'w-0'} 
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
                {isConnected ? 'ONLINE' : 'OFFLINE'}
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
          </div>
        </div>

        {/* Map Display */}
        <div className="flex-1 p-4">
          <div className="tactical-map h-full relative">
            <DroneMap
              telemetry={telemetry}
              waypoints={waypoints}
              isConnected={droneStatus.connected}
              onAddWaypoint={addWaypoint}
              onRemoveWaypoint={removeWaypoint}
            />
            
            {/* Tactical Overlay */}
            <div className="absolute top-4 right-4 tactical-card p-3 rounded max-w-xs">
              <div className="military-heading text-xs mb-2 flex items-center gap-2">
                <MapPin size={12} />
                TACTICAL MAP
              </div>
              <div className="text-xs text-gray-400 font-mono space-y-1">
                <div>• DOUBLE-CLICK: ADD WAYPOINT</div>
                <div>• SCROLL: ZOOM IN/OUT</div>
                <div>• DRAG: PAN VIEW</div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="text-xs text-gray-500 font-mono">
                  CLASSIFICATION: UNCLASSIFIED
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/70 z-0"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
