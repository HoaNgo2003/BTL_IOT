const mongoose = require("mongoose");

const deviceHistorySchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  action: {
    type: String,
    enum: ["Turned ON", "Turned OFF"],
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Tham chiếu đến người dùng thực hiện hành động
    required: true,
  },
});

const DeviceHistory = mongoose.model("DeviceHistory", deviceHistorySchema);

module.exports = DeviceHistory;
