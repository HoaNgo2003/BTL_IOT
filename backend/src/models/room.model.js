const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  temperature: {
    type: String,
    default: "Unknown",
  },
  humidity: {
    type: String,
    default: "Unknown",
  },
  lightLevel: {
    type: String,
    default: "Unknown",
  },
  devices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
  ],
  esp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Esp",
  },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
