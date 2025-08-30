import { useState, useEffect } from 'react';
import type { TelemetryData, Waypoint, DroneStatus } from '../types/index';
import { useWebSocket } from './useWebSocket';

export const useTelemetry = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    lat: 37.7749,
    lon: -122.4194,
    alt: 0,
    pitch: 0,
    roll: 0,
    yaw: 0,
    timestamp: Date.now(),
    battery: 100,
    satellites: 0
  });

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [droneStatus, setDroneStatus] = useState<DroneStatus>({
    connected: false,
    armed: false,
    mode: 'STABILIZE',
    lastUpdate: Date.now()
  });

  const { isConnected, lastMessage, sendMessage } = useWebSocket('ws://localhost:8080');

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'telemetry':
          setTelemetry(lastMessage.data);
          setDroneStatus(prev => ({ ...prev, connected: true, lastUpdate: Date.now() }));
          break;
        case 'waypoints':
          setWaypoints(lastMessage.data);
          break;
        case 'status':
          setDroneStatus(prev => ({ ...prev, ...lastMessage.data }));
          break;
      }
    }
  }, [lastMessage]);

  // Check for connection timeout
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - droneStatus.lastUpdate > 5000) {
        setDroneStatus(prev => ({ ...prev, connected: false }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [droneStatus.lastUpdate]);

  const addWaypoint = (lat: number, lon: number, name?: string) => {
    const waypoint: Waypoint = {
      id: Date.now().toString(),
      lat,
      lon,
      name: name || `Waypoint ${waypoints.length + 1}`,
      timestamp: Date.now()
    };

    sendMessage({
      type: 'addWaypoint',
      ...waypoint
    });
  };

  const removeWaypoint = (id: string) => {
    sendMessage({
      type: 'removeWaypoint',
      id
    });
  };

  return {
    telemetry,
    waypoints,
    droneStatus,
    isConnected,
    addWaypoint,
    removeWaypoint
  };
};
