import type { TelemetryData, DroneStatus } from '../../types';
import { DataCard } from './DataCard';
import { 
  Navigation, 
  MapPin, 
  Mountain, 
  RotateCcw, 
  Battery, 
  Satellite,
  Shield,
  Radio,
  Target,
  Zap
} from 'lucide-react';

interface TelemetryPanelProps {
  telemetry: TelemetryData;
  droneStatus: DroneStatus;
}

export const TelemetryPanel = ({ telemetry, droneStatus }: TelemetryPanelProps) => {
  const getConnectionStatus = (): 'operational' | 'warning' | 'critical' => {
    if (!droneStatus.connected) return 'critical';
    const timeSinceUpdate = Date.now() - droneStatus.lastUpdate;
    return timeSinceUpdate > 3000 ? 'warning' : 'operational';
  };

  const getBatteryStatus = (): 'operational' | 'warning' | 'critical' => {
    if (!telemetry.battery) return 'operational';
    if (telemetry.battery < 20) return 'critical';
    if (telemetry.battery < 40) return 'warning';
    return 'operational';
  };

  const getSatelliteStatus = (): 'operational' | 'warning' | 'critical' => {
    if (telemetry.satellites === undefined) return 'operational';
    if (telemetry.satellites >= 6) return 'operational';
    if (telemetry.satellites >= 4) return 'warning';
    return 'critical';
  };

  return (
    <div className="tactical-bg h-full overflow-y-auto">
      {/* Command Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-800 rounded border border-green-500">
            <Target className="text-green-400" size={20} />
          </div>
          <div>
            <h2 className="military-heading text-lg">TACTICAL CONTROL</h2>
            <p className="text-xs text-gray-500 font-mono">REAL-TIME SURVEILLANCE</p>
          </div>
        </div>
        
        {/* System Status */}
        <div className="tactical-card p-3 rounded">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`status-indicator w-2 h-2 rounded-full ${
                droneStatus.connected ? 'status-online' : 'status-offline'
              }`} />
              <span className="font-mono text-sm text-gray-300">
                {droneStatus.connected ? (
                  <div className="flex items-center gap-2">
                    <Radio size={14} />
                    LINK ACTIVE
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Radio size={14} />
                    LINK DOWN
                  </div>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className={droneStatus.armed ? 'text-red-500' : 'text-green-400'} />
              <span className={`text-xs font-mono ${
                droneStatus.armed ? 'text-red-400' : 'text-green-400'
              }`}>
                {droneStatus.armed ? 'ARMED' : 'SAFE'}
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            MODE: <span className="text-blue-400">{droneStatus.mode}</span>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            LAST PING: <span className="text-blue-400">
              {new Date(telemetry.timestamp).toLocaleTimeString('en-US', { hour12: false })}Z
            </span>
          </div>
        </div>
      </div>

      {/* GPS Coordinates */}
      <div className="p-6 border-b border-gray-800">
        <h3 className="military-heading text-sm mb-4 flex items-center gap-2">
          <MapPin size={16} />
          GPS COORDINATES
        </h3>
        <div className="space-y-4">
          <DataCard
            title="LATITUDE"
            value={telemetry.lat}
            unit="°"
            icon={<MapPin size={16} />}
            status={getConnectionStatus()}
            isUpdating={droneStatus.connected}
            classification="COORD"
          />
          
          <DataCard
            title="LONGITUDE"
            value={telemetry.lon}
            unit="°"
            icon={<MapPin size={16} />}
            status={getConnectionStatus()}
            isUpdating={droneStatus.connected}
            classification="COORD"
          />
          
          <DataCard
            title="ALTITUDE MSL"
            value={telemetry.alt}
            unit="M"
            icon={<Mountain size={16} />}
            status={getConnectionStatus()}
            isUpdating={droneStatus.connected}
            classification="ALT"
          />
        </div>
      </div>

      {/* Aircraft Attitude */}
      <div className="p-6 border-b border-gray-800">
        <h3 className="military-heading text-sm mb-4 flex items-center gap-2">
          <RotateCcw size={16} />
          AIRCRAFT ATTITUDE
        </h3>
        <div className="space-y-4">
          <DataCard
            title="PITCH ANGLE"
            value={telemetry.pitch}
            unit="°"
            icon={<RotateCcw size={16} />}
            status={getConnectionStatus()}
            isUpdating={droneStatus.connected}
            classification="ATT"
          />
          
          <DataCard
            title="ROLL ANGLE"
            value={telemetry.roll}
            unit="°"
            icon={<RotateCcw size={16} />}
            status={getConnectionStatus()}
            isUpdating={droneStatus.connected}
            classification="ATT"
          />
          
          <DataCard
            title="HEADING"
            value={telemetry.yaw}
            unit="°"
            icon={<Navigation size={16} />}
            status={getConnectionStatus()}
            isUpdating={droneStatus.connected}
            classification="HDG"
          />
        </div>
      </div>

      {/* System Status */}
      <div className="p-6">
        <h3 className="military-heading text-sm mb-4 flex items-center gap-2">
          <Zap size={16} />
          SYSTEM STATUS
        </h3>
        <div className="space-y-4">
          {telemetry.battery && (
            <DataCard
              title="POWER LEVEL"
              value={telemetry.battery}
              unit="%"
              icon={<Battery size={16} />}
              status={getBatteryStatus()}
              isUpdating={droneStatus.connected}
              classification="PWR"
            />
          )}
          
          {telemetry.satellites !== undefined && (
            <DataCard
              title="SAT COUNT"
              value={telemetry.satellites}
              icon={<Satellite size={16} />}
              status={getSatelliteStatus()}
              isUpdating={droneStatus.connected}
              classification="GPS"
            />
          )}
        </div>
      </div>
    </div>
  );
};
