import React, { useState } from "react";

function Home({ rooms, addRoom, selectRoom }) {
  const [newRoomName, setNewRoomName] = useState("");

  const handleAddRoom = () => {
    if (newRoomName.trim()) {
      addRoom(newRoomName);
      setNewRoomName(""); // Reset the input field
    }
  };

  return (
    <div>
      <header>
        <h1>Smart Home Control</h1>
      </header>
      <div className="container">
        <h2>Rooms</h2>
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <div className="room-header">
              <h3>{room.name}</h3>
            </div>
            <div className="room-details">
              <button onClick={() => selectRoom(room)}>Control Devices</button>
            </div>
          </div>
        ))}
        <div className="room-card">
          <div className="room-header">
            <h3>Add New Room</h3>
          </div>
          <div className="room-details">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Enter room name"
            />
            <button onClick={handleAddRoom}>Add Room</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
