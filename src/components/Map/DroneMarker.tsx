import { useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import type { TelemetryData } from '../../types/index';
import { createDroneIcon } from '../../utils/mapUtils';

interface DroneMarkerProps {
  telemetry: TelemetryData;
  isConnected: boolean;
}

export const DroneMarker = ({ telemetry, isConnected }: DroneMarkerProps) => {
  const markerRef = useRef<L.Marker>(null);
  const map = useMap();

  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current;
      marker.setIcon(createDroneIcon(telemetry.yaw));
    }
  }, [telemetry.yaw]);

  const centerOnDrone = () => {
    map.setView([telemetry.lat, telemetry.lon], 16);
  };

  return (
    <Marker
      ref={markerRef}
      position={[telemetry.lat, telemetry.lon]}
      icon={createDroneIcon(telemetry.yaw)}
    >
      <Popup>
        <div className="p-2">
          <div className="font-bold text-primary-600 mb-2">🚁 Drone Status</div>
          <div className="space-y-1 text-sm">
            <div>Status: <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span></div>
            <div>Lat: {telemetry.lat.toFixed(6)}°</div>
            <div>Lon: {telemetry.lon.toFixed(6)}°</div>
            <div>Alt: {telemetry.alt.toFixed(1)}m</div>
            <div>Heading: {telemetry.yaw.toFixed(1)}°</div>
            <button 
              onClick={centerOnDrone}
              className="mt-2 px-3 py-1 bg-primary-500 text-white rounded text-xs hover:bg-primary-600"
            >
              Center on Drone
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
