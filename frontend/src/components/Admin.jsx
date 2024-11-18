import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import RoomControl from "../components/RoomControl";
import axios from "axios";
import { BASE_URL } from "../config/const";
function Admin() {
  const token = JSON.parse(localStorage.getItem("token"));
  const [rooms, setRooms] = useState([]);
  const [listEsp, setLisEsp] = useState([]);

  const fetchData = async () => {
    const { data } = await axios.get(`${BASE_URL}/room`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const list = await axios.get(`${BASE_URL}/esps`);
    setLisEsp(list.data);
    console.log(data);
    setRooms(data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const addRoom = async () => {
    if (!newRoomName.trim()) {
      alert("Please enter a valid room name!");
      return;
    }

    const newRoom = {
      name: newRoomName,
      temperature: "Unknown",
      humidity: "Unknown",
      lightLevel: "Unknown",
      devices: [],
      esp: selectedType,
    };
    const { data } = await axios.post(`${BASE_URL}/room`, newRoom, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchData();
    setNewRoomName("");
  };

  const handleDeviceToggle = (roomId, deviceName) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              devices: room.devices.map((device) =>
                device.name === deviceName
                  ? {
                      ...device,
                      status: device.status === "ON" ? "OFF" : "ON",
                      history: [
                        ...device.history,
                        {
                          action:
                            device.status === "ON" ? "Turned OFF" : "Turned ON",
                          time: new Date().toLocaleString(),
                        },
                      ],
                    }
                  : device
              ),
            }
          : room
      )
    );
  };

  const handleClick = (room) => {
    setSelectedRoom(room);
  };

  const goBack = () => {
    setSelectedRoom(null);
  };
  const handleClickDelete = async (roomId) => {
    const { data } = await axios.delete(`${BASE_URL}/room/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchData();
  };
  return (
    <div className="App">
      <header className="App-header">
        <Header />
      </header>
      <div className="container">
        {!selectedRoom ? (
          <>
            <h2>Room Overview</h2>
            {rooms.map((room) => (
              <div key={room._id} className="room-card">
                <div className="room-header">
                  <h3>{room.name}</h3>
                </div>
                <div className="room-details">
                  <p>Devices: {room.devices.length}</p>

                  <button
                    className="control-btn"
                    onClick={() => handleClick(room)}
                  >
                    Manage Devices
                  </button>
                  <button
                    className="control-btn"
                    style={{ marginLeft: "5px", background: "red" }}
                    onClick={() => handleClickDelete(room._id)}
                  >
                    Delete Room
                  </button>
                </div>
              </div>
            ))}
            <div className="room-card add-room">
              <div className="room-header">
                <h3>Add New Room</h3>
              </div>
              <div className="room-details">
                <input
                  type="text"
                  placeholder="Enter room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{
                    padding: "5px",
                    outline: "none",
                    marginRight: "5px",
                  }}
                >
                  <option value="" disabled>
                    Select ESP
                  </option>
                  {listEsp.map((type, index) => (
                    <option value={type?._id}>{type?.name}</option>
                  ))}
                </select>
                <button className="control-btn" onClick={addRoom}>
                  Add Room
                </button>
              </div>
            </div>
          </>
        ) : (
          <RoomControl
            room={selectedRoom}
            setRooms={setRooms}
            goBack={goBack}
            setSelectedRoom={setSelectedRoom}
            handleDeviceToggle={handleDeviceToggle}
          />
        )}
      </div>
    </div>
  );
}

export default Admin;
