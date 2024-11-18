const express = require("express");
const router = express.Router();
const sensorController = require("../controller/sensor.controller.js");
router.get("/", sensorController.getAllData);
router.get("/one", sensorController.getOne);
module.exports = router;
