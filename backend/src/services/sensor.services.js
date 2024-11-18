const Sensor = require("../models/sensor.model.js");

const createSensorData = async (data) => {
  const sensorData = await Sensor.create(data);
  return sensorData;
};
const getAllData = async () => {
  return Sensor.find().sort({ updatedAt: -1 });
};
const getOneData = async () => {
  const data = await getAllData();

  return data[0];
};
module.exports = { createSensorData, getAllData, getOneData };
