import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { DroneMarker } from './DroneMarker';
import { WaypointMarker } from './WaypointMarker';
import type { TelemetryData, Waypoint } from '../../types/index';
import 'leaflet/dist/leaflet.css';

interface DroneMapProps {
  telemetry: TelemetryData;
  waypoints: Waypoint[];
  isConnected: boolean;
  onAddWaypoint: (lat: number, lon: number) => void;
  onRemoveWaypoint: (id: string) => void;
}

const MapEvents = ({ onAddWaypoint }: { onAddWaypoint: (lat: number, lon: number) => void }) => {
  useMapEvents({
    dblclick: (e) => {
      onAddWaypoint(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

export const DroneMap = ({ 
  telemetry, 
  waypoints, 
  isConnected, 
  onAddWaypoint, 
  onRemoveWaypoint 
}: DroneMapProps) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([telemetry.lat, telemetry.lon]);

  useEffect(() => {
    if (isConnected) {
      setMapCenter([telemetry.lat, telemetry.lon]);
    }
  }, [telemetry.lat, telemetry.lon, isConnected]);

  return (
    <div className="relative h-full">
      <MapContainer
        center={mapCenter}
        zoom={16}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <DroneMarker telemetry={telemetry} isConnected={isConnected} />
        
        {waypoints.map((waypoint, index) => (
          <WaypointMarker
            key={waypoint.id}
            waypoint={waypoint}
            index={index}
            onRemove={onRemoveWaypoint}
          />
        ))}
        
        <MapEvents onAddWaypoint={onAddWaypoint} />
      </MapContainer>
      
      <div className="absolute top-4 right-4 bg-white p-2 rounded shadow-lg text-sm">
        <div className="font-medium mb-1">🗺️ Map Controls</div>
        <div className="text-xs text-gray-600">
          Double-click to add waypoint
        </div>
      </div>
    </div>
  );
};
