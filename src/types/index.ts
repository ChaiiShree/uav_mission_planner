export interface TelemetryData {
  lat: number;
  lon: number;
  alt: number;
  pitch: number;
  roll: number;
  yaw: number;
  timestamp: number;
  battery?: number;
  satellites?: number;
}

export interface Waypoint {
  id: string;
  lat: number;
  lon: number;
  alt?: number;
  name: string;
  timestamp: number;
}

export interface DroneStatus {
  connected: boolean;
  armed: boolean;
  mode: string;
  lastUpdate: number;
}
