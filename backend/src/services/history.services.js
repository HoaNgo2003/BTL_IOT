const History = require("../models/history.model");
const Room = require("../models/room.model");
const Device = require("../models/device.model");
const DeviceHistory = require("../models/history.model");
const User = require("../models/user.model");
const createHistory = async (data) => {
  const newHistory = await History.create(data);
  return newHistory;
};
const getAllHistory = async () => {
  const data = await History.find()
    .sort({ updatedAt: -1 })
    .populate("device")
    .populate("user");
  return data;
};
async function toggleDevice({ roomId, deviceName, userId, status }) {
  const room = await Room.findById(roomId).populate("devices");
  const device = room.devices.find((dev) => dev._id == deviceName);

  if (!device) {
    throw new Error("Device not found!");
  }
  console.log(userId);
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found!");
  }

  // Toggle trạng thái thiết bị

  await device.save();
  // console.log(user);
  // Lưu lịch sử bật/tắt thiết bị
  const history = new DeviceHistory({
    device: deviceName,
    action: status === "ON" ? "Turned ON" : "Turned OFF",
    user: user._id,
  });
  await history.save();

  // Thêm lịch sử vào thiết bị
  device.history.push(history._id);
  await device.save();
}
module.exports = { createHistory, getAllHistory, toggleDevice };
