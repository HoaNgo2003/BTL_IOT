const sensorService = require("../services/sensor.services.js");
const getAllData = async (req, res) => {
  try {
    const data = await sensorService.getAllData();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
};
const getOne = async (req, res) => {
  try {
    const data = await sensorService.getOneData();
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
};
module.exports = { getAllData, getOne };
