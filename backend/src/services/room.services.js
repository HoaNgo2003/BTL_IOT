const Room = require("../models/room.model");
const Device = require("../models/device.model");
const createRoom = async (data) => {
  return Room.create(data);
};
const updateRoom = async ({ deviceData }, roomId) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("room not found");
  }
  console.log(deviceData);
  if (!deviceData || !deviceData.name || !deviceData.type) {
    throw new Error("Invalid device data: name and type are required.");
  }
  console.log(deviceData);
  const newDevice = await Device.create({
    name: deviceData.name,
    type: deviceData.type,
  });
  room.devices.push(newDevice);
  await room.save();
  // const update = await Room.updateOne({ _id: roomId, {...room} });
  return room;
};
const deleteDeviceFromRoom = async (deviceId, roomId) => {
  // Find the room by ID
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error("Room not found");
  }

  // Check if the device exists in the room
  const deviceIndex = room.devices.findIndex(
    (device) => device.toString() === deviceId
  );
  if (deviceIndex === -1) {
    throw new Error("Device not found in the room");
  }

  // Remove the device from the devices array
  room.devices.splice(deviceIndex, 1);

  // Save the room
  await room.save();

  // Delete the device from the Device collection
  await Device.findByIdAndDelete(deviceId);

  return room;
};

const deleteRoom = async (roomId) => {
  return Room.deleteOne({ _id: roomId });
};
const getAllRoom = async () => {
  return Room.find()
    .populate("esp") // Populate thông tin của ESP
    .populate("devices"); // Populate danh sách thiết bị;
};
const getRoomById = async (roomId) => {
  return Room.findById(roomId)
    .populate("esp") // Populate thông tin của ESP
    .populate("devices"); // Populate danh sách thiết bị;;
};
module.exports = {
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRoom,
  getRoomById,
  deleteDeviceFromRoom,
};
