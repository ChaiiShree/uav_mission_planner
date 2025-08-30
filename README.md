# 🚁 UAV Mission Planner

A complete real-time drone telemetry and mission planning system with ESP32 flight controller integration. Features a military-themed tactical dashboard with live GPS tracking, attitude monitoring, and waypoint management.

![Dashboard Preview](https://img.shields.io/badge/Dashboard-Military%20Theme-darkgreen)
![ESP32](https://img.shields.io/badge/Hardware-ESP32-blue)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933)

## ✨ Features

### 🎛️ Tactical Dashboard
- **Real-time GPS tracking** with interactive Leaflet.js map
- **Military-themed UI** with dark command center aesthetics
- **Live telemetry display** - altitude, attitude, battery, GPS satellites
- **Waypoint management** - double-click to add, click to remove
- **WebSocket real-time updates** with auto-reconnection
- **Responsive design** - works on desktop, tablet, and mobile
- **Status monitoring** - armed/disarmed, flight mode, connection status

### 🚁 Flight Controller (ESP32)
- **Complete hexacopter flight control** with 6-motor support
- **Multi-sensor integration** - MPU9250, BMP280, GPS
- **Advanced PID control** with multiple flight modes:
  - STABILIZE - Self-leveling mode
  - ALTITUDE_HOLD - Automatic altitude maintenance
  - ACRO - Rate-based aerobatic mode
- **Safety features** - RC failsafe, arming sequences, motor mixing
- **Real-time telemetry transmission** via WiFi
- **Multi-network WiFi support** with auto-switching

### 🌐 Backend Server
- **RESTful API** for telemetry and waypoint management
- **WebSocket broadcasting** for real-time client updates
- **CORS support** for cross-origin requests
- **Health monitoring** and connection status tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Arduino IDE with ESP32 board support
- ESP32 development board
- Sensors: MPU9250, BMP280 (optional: GPS module)

### 1. Clone Repository

```shell
git clone https://github.com/yourusername/uav-mission-control.git
cd uav-mission-control
```

### 2. Setup Backend Server

```shell
cd server
npm install
npm start
```
Server runs on `http://localhost:8080`

### 3. Setup Frontend Dashboard

```shell
cd dashboard
npm install
npm run dev
```
Dashboard available at `http://localhost:3000`

### 4. ESP32 Flight Controller Setup

#### Hardware Connections

ESP32 Pinout:
```
├── MPU9250 (I2C)
│   ├── SDA → GPIO 21
│   ├── SCL → GPIO 22
│   └── VCC → 3.3V, GND → GND
├── BMP280 (I2C)
│   ├── SDA → GPIO 32
│   ├── SCL → GPIO 33
│   └── VCC → 3.3V, GND → GND
├── RC Inputs (PWM)
│   ├── Roll → GPIO 34
│   ├── Pitch → GPIO 35
│   ├── Throttle → GPIO 4
│   └── Yaw → GPIO 2
├── ESC Outputs (6x motors)
│   └── GPIOs: 5, 18, 23, 13, 19, 25
└── Battery Monitor → GPIO 36
```

#### Arduino IDE Setup
1. Install libraries:
   - ArduinoJson
   - Adafruit BMP280
   - WiFi (built-in)
   - HTTPClient (built-in)

2. Update WiFi credentials in `flight.ino`:

```cpp
WiFiNetwork wifiNetworks[] = {
  {"YourWiFi_5G", "your_password"},
  {"YourWiFi_2.4G", "your_password"},
  {"Mobile_Hotspot", "hotspot_password"}
};
```

3. Update server IP:

```cpp
const char* TELEMETRY_SERVER_URL = "http://192.168.1.100:8080/telemetry";
```

4. Upload to ESP32 and monitor Serial output

## 📁 Project Structure

uav-mission-control/
├── 📁 dashboard/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ │ ├── Map/ # Drone map components
│ │ │ ├── Telemetry/ # Data display components
│ │ │ └── Layout/ # Dashboard layout
│ │ ├── hooks/ # Custom React hooks
│ │ ├── types/ # TypeScript definitions
│ │ └── utils/ # Map utilities
│ ├── package.json
│ └── vite.config.ts
├── 📁 server/ # Node.js backend
│ ├── server.js # Express + WebSocket server
│ └── package.json
├── 📁 esp32/ # Flight controller code
│ └── flight.ino # Complete FC with telemetry
├── README.md
└── .gitignore

## 🎯 Usage

### Flight Operations
1. **Power on** ESP32 flight controller
2. **Start dashboard** server and frontend
3. **Verify connection** - check WiFi status and telemetry feed
4. **Arm drone** - Throttle low + Yaw right for 3 seconds
5. **Monitor flight** - Real-time telemetry on dashboard
6. **Plan missions** - Add waypoints by double-clicking map
7. **Disarm safely** - Throttle low + Yaw left for 2 seconds

### Dashboard Controls
- **Double-click map** → Add waypoint
- **Click waypoint** → View/remove waypoint  
- **Sidebar toggle** → Show/hide telemetry panel
- **Map zoom/pan** → Navigate flight area

### Flight Modes
- **STABILIZE** - Self-leveling flight (beginner)
- **ALTITUDE_HOLD** - Maintains altitude automatically  
- **ACRO** - Full manual control (advanced)

## 🛡️ Safety Features

- **RC Failsafe** - Motors stop if signal lost
- **Arming sequences** - Prevents accidental motor start
- **Battery monitoring** - Low voltage warnings
- **GPS satellite count** - Navigation readiness
- **Connection status** - Real-time link monitoring

## 🔧 Configuration

### Server Port

```shell
PORT=8080 npm start
```

### WiFi Networks
Add multiple networks in flight controller:

```cpp
WiFiNetwork wifiNetworks[] = {
  {"Primary_Network", "password1"},
  {"Backup_Network", "password2"},
  {"Mobile_Hotspot", "password3"}
};
```

### Telemetry Rate

```cpp
const unsigned long TELEMETRY_INTERVAL = 1000; // milliseconds
```

## 🐛 Troubleshooting

### ESP32 Issues
- **WiFi not connecting** → Check credentials and signal strength
- **No telemetry data** → Verify server IP and port
- **Sensor errors** → Check I2C wiring and power

### Dashboard Issues  
- **No real-time updates** → Check WebSocket connection
- **Map not loading** → Check internet for tiles
- **Connection errors** → Verify server is running

### Network Issues
- **Cross-device access** → Use computer's IP instead of localhost
- **Firewall blocking** → Allow ports 3000 and 8080
- **Different subnets** → Ensure same WiFi network

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Leaflet.js for interactive mapping
- React team for the amazing framework
- ESP32 community for hardware support
- Flight controller algorithms inspired by ArduPilot

## ⚠️ Disclaimer

This is experimental flight control software. Always test thoroughly in safe environments. Users assume all responsibility for safe operation. Never fly over people or property without proper authorization.

---

**Built with ❤️ for the drone community**
