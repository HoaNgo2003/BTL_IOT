const mongoose = require("mongoose");

const espSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    require: true,
  },
});

const ESP = mongoose.model("Esp", espSchema);

module.exports = ESP;
