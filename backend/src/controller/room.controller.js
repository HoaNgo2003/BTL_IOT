const roomService = require("../services/room.services.js");

// Lấy tất cả các phòng
const getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRoom();
    return res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch rooms",
    });
  }
};

// Lấy thông tin chi tiết một phòng theo ID
const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await roomService.getRoomById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    return res.status(200).json(room);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch room details",
    });
  }
};

// Tạo mới một phòng
const createRoom = async (req, res) => {
  try {
    const roomData = req.body;
    const newRoom = await roomService.createRoom(roomData);

    return res.status(201).json(newRoom);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Failed to create room",
    });
  }
};

// Cập nhật thông tin phòng (thêm thiết bị mới)
const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const deviceData = req.body;

    const updatedRoom = await roomService.updateRoom(deviceData, roomId);

    return res.status(200).json({
      message: "Room updated successfully",
      updatedRoom,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Failed to update room",
    });
  }
};
const deleteDeviceFromRoom = async (req, res) => {
  try {
    const { roomId, deviceId } = req.params;

    const updatedRoom = await roomService.deleteDeviceFromRoom(
      deviceId,
      roomId
    );

    return res.status(200).json({
      message: "Device deleted successfully",
      updatedRoom,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Failed to delete device from room",
    });
  }
};

// Xóa phòng theo ID
const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    await roomService.deleteRoom(roomId);

    return res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Failed to delete room",
    });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  deleteDeviceFromRoom,
};
