import type { TelemetryData, DroneStatus } from '../../types';
import { DataCard } from './DataCard';
import { Navigation, MapPin, Mountain, RotateCcw, Battery, Satellite, Shield, Radio, Target, Zap, Activity, Clock, Compass } from 'lucide-react';

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
    <div className="telemetry-container h-full flex flex-col">
      {/* Header Section */}
      <div className="telemetry-header p-4 border-b border-gray-600">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="text-green-400" size={20} />
          <h2 className="military-heading text-lg">TELEMETRY</h2>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className={`status-indicator w-2 h-2 rounded-full ${
            droneStatus.connected ? 'status-online' : 'status-offline'
          }`} />
          <span className="text-gray-300 font-mono">
            {droneStatus.connected ? 'DATALINK ACTIVE' : 'DATALINK DOWN'}
          </span>
        </div>
      </div>

      {/* Telemetry Data */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
        
        {/* Primary Flight Data - Compact Layout */}
        <div className="telemetry-section">
          <div className="section-header mb-2">
            <MapPin size={16} className="text-blue-400" />
            <span>POSITION & NAVIGATION</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="position-grid">
              <DataCard
                title="LATITUDE"
                value={telemetry.lat.toFixed(6)}
                unit="°"
                icon={<MapPin size={16} />}
                status="operational"
                size="normal"
              />
              <DataCard
                title="LONGITUDE"
                value={telemetry.lon.toFixed(6)}
                unit="°"
                icon={<MapPin size={16} />}
                status="operational"
                size="normal"
              />
            </div>
            <div className="position-grid">
              <DataCard
                title="ALTITUDE"
                value={telemetry.alt.toFixed(1)}
                unit="m"
                icon={<Mountain size={16} />}
                status="operational"
                size="normal"
              />
              <DataCard
                title="HEADING"
                value={telemetry.yaw.toFixed(1)}
                unit="°"
                icon={<Compass size={16} />}
                status="operational"
                size="normal"
              />
            </div>
          </div>
        </div>

        {/* Velocity Section */}
        <div className="telemetry-section">
          <div className="section-header mb-2">
            <Target size={16} className="text-yellow-400" />
            <span>VELOCITY VECTOR</span>
          </div>
          <div className="velocity-grid">
            <DataCard
              title="X-AXIS"
              value={telemetry.vx?.toFixed(2) || '0.00'}
              unit="m/s"
              icon={<div className="velocity-axis">X</div>}
              status="operational"
              size="compact"
            />
            <DataCard
              title="Y-AXIS"
              value={telemetry.vy?.toFixed(2) || '0.00'}
              unit="m/s"
              icon={<div className="velocity-axis">Y</div>}
              status="operational"
              size="compact"
            />
            <DataCard
              title="Z-AXIS"
              value={telemetry.vz?.toFixed(2) || '0.00'}
              unit="m/s"
              icon={<div className="velocity-axis">Z</div>}
              status="operational"
              size="compact"
            />
          </div>
        </div>

        {/* Attitude Section */}
        <div className="telemetry-section">
          <div className="section-header mb-2">
            <RotateCcw size={16} className="text-purple-400" />
            <span>ATTITUDE</span>
          </div>
          <div className="attitude-grid">
            <DataCard
              title="ROLL"
              value={telemetry.roll?.toFixed(1) || '0.0'}
              unit="°"
              icon={<div className="attitude-icon roll">⟲</div>}
              status="operational"
              size="compact"
            />
            <DataCard
              title="PITCH"
              value={telemetry.pitch?.toFixed(1) || '0.0'}
              unit="°"
              icon={<div className="attitude-icon pitch">⟳</div>}
              status="operational"
              size="compact"
            />
            <DataCard
              title="YAW"
              value={telemetry.yaw.toFixed(1)}
              unit="°"
              icon={<div className="attitude-icon yaw">↻</div>}
              status="operational"
              size="compact"
            />
          </div>
        </div>

        {/* System Status */}
        <div className="telemetry-section">
          <div className="section-header mb-2">
            <Shield size={16} className="text-red-400" />
            <span>SYSTEM STATUS</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <DataCard
              title="POWER LEVEL"
              value={telemetry.battery || 0}
              unit="%"
              icon={<Battery size={18} />}
              status={getBatteryStatus()}
              size="large"
              showProgress={true}
              progressValue={telemetry.battery || 0}
            />
            <div className="position-grid">
              <DataCard
                title="GPS LOCK"
                value={telemetry.satellites || 0}
                unit="SATS"
                icon={<Satellite size={16} />}
                status={getSatelliteStatus()}
                size="normal"
              />
              <DataCard
                title="SIGNAL"
                value="STRONG"
                icon={<Radio size={16} />}
                status="operational"
                size="normal"
              />
            </div>
          </div>
        </div>

        {/* Mission Status */}
        <div className="telemetry-section">
          <div className="section-header mb-2">
            <Zap size={16} className="text-orange-400" />
            <span>MISSION STATUS</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <DataCard
              title="FLIGHT MODE"
              value={telemetry.mode || 'STABILIZE'}
              icon={<Shield size={18} />}
              status="operational"
              size="large"
            />
            <DataCard
              title="ARM STATUS"
              value={telemetry.armed ? 'ARMED' : 'DISARMED'}
              icon={<Zap size={18} />}
              status={telemetry.armed ? 'operational' : 'warning'}
              size="large"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
