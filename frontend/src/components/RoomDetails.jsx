import React, { useState } from "react";

function RoomDetails({ room, goBack, setRooms }) {
  const [deviceStatus, setDeviceStatus] = useState({});

  const toggleDevice = (deviceName) => {
    setDeviceStatus({
      ...deviceStatus,
      [deviceName]: deviceStatus[deviceName] === "ON" ? "OFF" : "ON",
    });
  };

  return (
    <div>
      <header>
        <button onClick={goBack}>Back to Home</button>
        <h1>Control Room: {room.name}</h1>
      </header>
      <div className="container">
        <h2>Devices</h2>
        {room.devices.map((device, index) => (
          <div key={index} className="device-card">
            <div className="device-header">
              <h3>{device.name}</h3>
            </div>
            <div className="device-controls">
              <button onClick={() => toggleDevice(device.name)}>
                {deviceStatus[device.name] === "ON" ? "Turn Off" : "Turn On"}
              </button>
            </div>
          </div>
        ))}
        <div className="history">
          <h3>Device History</h3>
          <ul>
            {room.history.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RoomDetails;
