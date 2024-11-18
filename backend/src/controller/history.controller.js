const historyService = require("../services/history.services.js");
const getAllData = async (req, res) => {
  try {
    const data = await historyService.getAllHistory();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
};
const toggleDevice = async (req, res) => {
  try {
    const data = await historyService.toggleDevice(req.body);
    return res.status(201).json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
};
module.exports = { getAllData, toggleDevice };
