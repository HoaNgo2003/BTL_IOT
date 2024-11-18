const ESP = require("../models/esp.model");

// Tạo ESP mới
const createESP = async (data) => {
  return ESP.create(data);
};

// Lấy tất cả ESPs
const getAllESPs = async () => {
  return ESP.find();
};

module.exports = {
  createESP,
  getAllESPs,
};
