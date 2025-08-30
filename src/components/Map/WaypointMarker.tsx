import { Marker, Popup } from 'react-leaflet';
import type { Waypoint } from '../../types/index';
import { createWaypointIcon } from '../../utils/mapUtils';
import { Trash2 } from 'lucide-react';

interface WaypointMarkerProps {
  waypoint: Waypoint;
  index: number;
  onRemove: (id: string) => void;
}

export const WaypointMarker = ({ waypoint, index, onRemove }: WaypointMarkerProps) => {
  return (
    <Marker
      position={[waypoint.lat, waypoint.lon]}
      icon={createWaypointIcon(index + 1)}
    >
      <Popup>
        <div className="p-2">
          <div className="font-bold text-red-600 mb-2">📍 {waypoint.name}</div>
          <div className="space-y-1 text-sm">
            <div>Lat: {waypoint.lat.toFixed(6)}°</div>
            <div>Lon: {waypoint.lon.toFixed(6)}°</div>
            {waypoint.alt && <div>Alt: {waypoint.alt}m</div>}
            <button 
              onClick={() => onRemove(waypoint.id)}
              className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 flex items-center gap-1"
            >
              <Trash2 size={12} />
              Remove
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};
