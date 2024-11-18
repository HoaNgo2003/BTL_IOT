import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CardItemData from "./CardItem";
import DataSensor from "./DataSensor";
import axios from "axios";
import { BASE_URL } from "../config/const";
import DataHistory from "./DataHistory";
import Data from "./Data";
const TYPE = {
  light: "Light",
  fan: "Fan",
};
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));
const RoomControl = ({ room, goBack, setRooms, setSelectedRoom }) => {
  const [autoMode, setAutoMode] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("light");
  const [deviceId, setDeviceId] = useState("");
  const [history, setHistory] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(room);
  const token = JSON.parse(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const fetchRoom = async () => {
    const { data } = await axios.get(`${BASE_URL}/room/${room._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
    setCurrentRoom(data);
  };
  useEffect(() => {
    fetchRoom();
  }, []);
  const toggleDevice = (deviceId, device) => {
    console.log(device);
    const updatedDevices = currentRoom.devices.map((device) =>
      device._id === deviceId ? { ...device, state: !device.state } : device
    );
    console.log(currentRoom.devices, deviceId);
    currentRoom.devices = updatedDevices;
    // setRooms((prev) => prev.map((r) => (r._id === room._id ? { ...room } : r)));
  };

  const addDevice = async (roomId) => {
    if (newDeviceName.trim()) {
      const newDevice = {
        name: newDeviceName,
        type: newDeviceType.toLowerCase(),
      };
      // console.log(newD)
      const { data } = await axios.patch(
        `${BASE_URL}/room/${roomId}`,
        {
          deviceData: newDevice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      fetchRoom();
      console.log(currentRoom);
      // setCurrentRoom(data);
      console.log(currentRoom);
      // room.devices.push(newDevice);
      // setRooms((prev) =>
      //   prev.map((r) => (r._id === room._id ? { ...room } : r))
      // );
      setNewDeviceName("");
    } else {
      alert("Please enter a valid device name!");
    }
  };
  const handleMode = async (e) => {
    setAutoMode(e.target.checked);

    const { data } = await axios.post(
      `${BASE_URL}/mode`,
      {
        auto: e.target.checked,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(e.target.checked);
    if (e.target.checked === false) {
      currentRoom.devices.forEach(async (item) => {
        await handleTurnOff(item._id, item.type);
      });
    }
    fetchRoom();
  };
  const handleDelete = async (roomId) => {
    console.log(roomId);
    console.log(deviceId);
    const { data } = await axios.delete(
      `${BASE_URL}/room/${roomId}/device/${deviceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const roomData = await axios.get(`${BASE_URL}/room/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCurrentRoom(roomData.data);
    setRooms((prev) =>
      prev.map((r) => (r._id === room._id ? { ...roomData.data } : r))
    );
    console.log(roomData.data);
  };
  const handleTurnOn = async (deviceId, type) => {
    console.log(deviceId);
    const { data } = await axios.post(
      `${BASE_URL}/${type}`,
      {
        state: true,
        deviceId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchRoom();

    const history = await axios.post(
      `${BASE_URL}/history`,
      {
        roomId: currentRoom._id,
        deviceName: deviceId,
        userId: user?._id,
        status: "ON",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const handleTurnOff = async (deviceId, type) => {
    console.log("hi");
    const { data } = await axios.post(
      `${BASE_URL}/${type}`,
      {
        state: false,
        deviceId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchRoom();
    const history = await axios.post(
      `${BASE_URL}/history`,
      {
        roomId: currentRoom._id,
        deviceName: deviceId,
        userId: user?._id,
        status: "OFF",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
  return (
    <div className="container">
      <button onClick={goBack} className="back-btn" style={{ margin: "15px" }}>
        &larr; Back to Rooms
      </button>
      <header>
        <h1>{room.name} Control</h1>
      </header>
      <div className="card">
        <h2>Room Data</h2>
        {/* <p>
          <strong>Temperature:</strong> 24°C
        </p>
        <p>
          <strong>Humidity:</strong> 45%
        </p>
        <p>
          <strong>Light Level:</strong> 300
        </p> */}
        <Data />
      </div>

      <div className="card">
        <h2>Devices</h2>
        <label>
          <input
            type="checkbox"
            checked={autoMode}
            onChange={(e) => handleMode(e)}
          />
          Auto Mode
        </label>
        <div>
          {currentRoom.devices.map((device) => (
            <div key={device._id} className="device-control">
              <label>
                {device.name} ({device.type})
              </label>
              <button
                style={{
                  background: "green",
                  margin: "5px",
                }}
                onClick={() => toggleDevice(device._id, device.type)}
                disabled
              >
                status: {device.status}
              </button>
              <button
                style={{
                  marginRight: "5px",

                  background: `${autoMode === false ? `#0451F3` : `#7F7F7F`}`,
                }}
                onClick={() => handleTurnOn(device._id, device.type)}
                disabled={autoMode === true ? true : false}
              >
                TURN ON
              </button>
              <button
                style={{
                  marginRight: "5px",

                  background: `${autoMode === false ? `#0451F3` : `#7F7F7F`}`,
                }}
                onClick={() => handleTurnOff(device._id, device.type)}
                disabled={autoMode === true ? true : false}
              >
                TURN OFF
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card add-device-form">
        <h2>Add New Device</h2>
        <input
          type="text"
          placeholder="Device Name"
          value={newDeviceName}
          onChange={(e) => setNewDeviceName(e.target.value)}
        />
        <select
          value={newDeviceType}
          onChange={(e) => setNewDeviceType(e.target.value)}
        >
          <option value="Light">Light</option>
          <option value="Fan">Fan</option>
        </select>
        <button onClick={() => addDevice(room._id)}>Add Device</button>
      </div>
      <div className="card add-device-form">
        <h2>Delete Device</h2>

        <select value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
          <option value={""}>Device</option>
          {currentRoom?.devices.map((item) => {
            return <option value={item._id}>{item.name}</option>;
          })}
        </select>
        <button
          style={{ background: "red" }}
          onClick={() => handleDelete(room._id)}
        >
          Delete Device
        </button>
      </div>
      <div className="card">
        {/* <h2>Device History</h2>
        <table className="history-table">
          <thead>
            <tr>
              <th>Device</th>
              <th>Action</th>
              <th>Time</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {/* Add dynamic history rows here */}
        {/* <tr>
              <td>Light 1</td>
              <td>ON</td>
              <td>2024-11-17 14:30</td>
              <td>Hoa</td>
            </tr>
          </tbody> */}
        {/* </table>  */}

        <DataHistory />
      </div>
      <div className="card">
        <DataSensor />
      </div>
    </div>
  );
};

export default RoomControl;
