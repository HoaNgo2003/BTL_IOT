const espService = require("../services/esp.service");

// API tạo mới ESP
const createESP = async (req, res) => {
  try {
    const data = await espService.createESP(req.body);
    return res.status(201).json({
      message: "ESP created successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Failed to create ESP",
    });
  }
};

// API lấy danh sách ESPs
const getAllESPs = async (req, res) => {
  try {
    const data = await espService.getAllESPs();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Failed to fetch ESPs",
    });
  }
};

module.exports = {
  createESP,
  getAllESPs,
};
