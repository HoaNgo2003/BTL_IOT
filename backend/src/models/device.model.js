const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["light", "fan", "AC"], // Các loại thiết bị khác có thể thêm vào đây
  },
  status: {
    type: String,
    enum: ["ON", "OFF"],
    default: "OFF",
  },
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeviceHistory",
    },
  ],
});

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
