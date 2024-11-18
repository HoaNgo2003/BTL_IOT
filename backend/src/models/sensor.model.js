const mongoose = require("mongoose");
const { Schema } = mongoose;
// {"temperature":26.7,"humidity":64,"lightLevel":0}
const sensorTempSchema = new Schema(
  {
    temperature: {
      type: Number,
      require: true,
    },
    humidity: {
      type: Number,
      require: true,
    },
    lightLevel: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);
const Temperature = mongoose.model("sensor", sensorTempSchema);
module.exports = Temperature;
