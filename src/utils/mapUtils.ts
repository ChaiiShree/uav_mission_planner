import L from 'leaflet';

export const createDroneIcon = (rotation: number = 0) => {
  const droneIcon = `
    <div style="position: relative; transform: rotate(${rotation}deg);">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Main body - military green -->
        <circle cx="18" cy="18" r="5" fill="#3fb950" stroke="#2f8040" stroke-width="2"/>
        <circle cx="18" cy="18" r="2" fill="#58a6ff"/>
        
        <!-- Arms -->
        <line x1="18" y1="9" x2="18" y2="5" stroke="#3fb950" stroke-width="3"/>
        <line x1="18" y1="27" x2="18" y2="31" stroke="#3fb950" stroke-width="3"/>
        <line x1="27" y1="18" x2="31" y2="18" stroke="#3fb950" stroke-width="3"/>
        <line x1="9" y1="18" x2="5" y2="18" stroke="#3fb950" stroke-width="3"/>
        
        <!-- Propellers -->
        <circle cx="18" cy="5" r="2.5" fill="#f85149" stroke="#d73a49" stroke-width="1"/>
        <circle cx="18" cy="31" r="2.5" fill="#3fb950" stroke="#2f8040" stroke-width="1"/>
        <circle cx="31" cy="18" r="2.5" fill="#3fb950" stroke="#2f8040" stroke-width="1"/>
        <circle cx="5" cy="18" r="2.5" fill="#3fb950" stroke="#2f8040" stroke-width="1"/>
        
        <!-- Direction indicator -->
        <polygon points="18,10 16,6 20,6" fill="#f85149"/>
        
        <!-- Tactical markings -->
        <text x="18" y="22" font-family="monospace" font-size="6" fill="#58a6ff" text-anchor="middle">UAV</text>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: droneIcon,
    className: 'drone-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

export const createWaypointIcon = (number: number) => {
  const waypointIcon = `
    <div style="
      position: relative;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        background: linear-gradient(135deg, #d29922 0%, #b8860b 100%);
        border-radius: 4px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0d1117;
        font-weight: bold;
        font-size: 10px;
        font-family: 'JetBrains Mono', monospace;
        border: 2px solid #3fb950;
        box-shadow: 0 0 10px rgba(210, 153, 34, 0.5);
      ">${number.toString().padStart(2, '0')}</div>
    </div>
  `;

  return L.divIcon({
    html: waypointIcon,
    className: 'waypoint-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};
