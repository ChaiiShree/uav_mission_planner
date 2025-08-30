const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Store connected clients
const clients = new Set();

// Store current telemetry data
let currentTelemetry = {
  lat: 37.7749,
  lon: -122.4194,
  alt: 0,
  pitch: 0,
  roll: 0,
  yaw: 0,
  timestamp: Date.now(),
  battery: 100,
  satellites: 8
};

// Store waypoints
let waypoints = [];

// Store drone status
let droneStatus = {
  connected: false,
  armed: false,
  mode: 'STABILIZE',
  lastUpdate: Date.now()
};

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);

  // Send current data to new client
  ws.send(JSON.stringify({
    type: 'telemetry',
    data: currentTelemetry
  }));

  ws.send(JSON.stringify({
    type: 'waypoints',
    data: waypoints
  }));

  ws.send(JSON.stringify({
    type: 'status',
    data: droneStatus
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'addWaypoint') {
        const waypoint = {
          id: data.id || Date.now().toString(),
          lat: data.lat,
          lon: data.lon,
          alt: data.alt,
          name: data.name || `Waypoint ${waypoints.length + 1}`,
          timestamp: Date.now()
        };
        
        waypoints.push(waypoint);
        broadcast({
          type: 'waypoints',
          data: waypoints
        });
        
        console.log('New waypoint added:', waypoint);
      }

      if (data.type === 'removeWaypoint') {
        waypoints = waypoints.filter(wp => wp.id !== data.id);
        broadcast({
          type: 'waypoints',
          data: waypoints
        });
        
        console.log('Waypoint removed:', data.id);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Broadcast function
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// ESP32 Telemetry endpoint
app.post('/telemetry', (req, res) => {
  try {
    const { lat, lon, alt, pitch, roll, yaw, battery, satellites, armed, mode } = req.body;

    // Validate required fields
    if (typeof lat !== 'number' || typeof lon !== 'number' ||
        typeof alt !== 'number' || typeof pitch !== 'number' ||
        typeof roll !== 'number' || typeof yaw !== 'number') {
      return res.status(400).json({
        error: 'Invalid telemetry data. lat, lon, alt, pitch, roll, yaw must be numbers.'
      });
    }

    // Update telemetry
    currentTelemetry = {
      lat,
      lon,
      alt,
      pitch,
      roll,
      yaw,
      timestamp: Date.now(),
      battery: battery || currentTelemetry.battery,
      satellites: satellites !== undefined ? satellites : currentTelemetry.satellites
    };

    // Update drone status
    droneStatus = {
      connected: true,
      armed: armed !== undefined ? armed : droneStatus.armed,
      mode: mode || droneStatus.mode,
      lastUpdate: Date.now()
    };

    // Broadcast to all connected clients
    broadcast({
      type: 'telemetry',
      data: currentTelemetry
    });

    broadcast({
      type: 'status',
      data: droneStatus
    });

    console.log('Telemetry received:', {
      position: `${lat.toFixed(6)}, ${lon.toFixed(6)}`,
      altitude: `${alt.toFixed(1)}m`,
      attitude: `P:${pitch.toFixed(1)}° R:${roll.toFixed(1)}° Y:${yaw.toFixed(1)}°`
    });

    res.status(200).json({
      message: 'Telemetry received successfully',
      timestamp: currentTelemetry.timestamp
    });
  } catch (error) {
    console.error('Error processing telemetry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// REST API endpoints
app.get('/api/telemetry', (req, res) => {
  res.json(currentTelemetry);
});

app.get('/api/waypoints', (req, res) => {
  res.json(waypoints);
});

app.get('/api/status', (req, res) => {
  res.json(droneStatus);
});

app.post('/api/waypoints', (req, res) => {
  try {
    const { lat, lon, alt, name } = req.body;
    
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
    }

    const waypoint = {
      id: Date.now().toString(),
      lat,
      lon,
      alt,
      name: name || `Waypoint ${waypoints.length + 1}`,
      timestamp: Date.now()
    };

    waypoints.push(waypoint);
    
    broadcast({
      type: 'waypoints',
      data: waypoints
    });

    res.status(201).json(waypoint);
  } catch (error) {
    console.error('Error adding waypoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/waypoints/:id', (req, res) => {
  try {
    const id = req.params.id;
    const initialLength = waypoints.length;
    waypoints = waypoints.filter(wp => wp.id !== id);

    if (waypoints.length === initialLength) {
      return res.status(404).json({ error: 'Waypoint not found' });
    }

    broadcast({
      type: 'waypoints',
      data: waypoints
    });

    res.status(200).json({ message: 'Waypoint deleted successfully' });
  } catch (error) {
    console.error('Error deleting waypoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    clients: clients.size,
    waypoints: waypoints.length,
    lastTelemetry: currentTelemetry.timestamp
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚁 Drone Mission Planner Server running on http://localhost:${PORT}`);
  console.log(`📡 Telemetry endpoint: http://localhost:${PORT}/telemetry`);
  console.log(`🌐 WebSocket server ready for real-time updates`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
