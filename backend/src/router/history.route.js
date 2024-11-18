const express = require("express");
const router = express.Router();
const historyController = require("../controller/history.controller.js");
router.get("/", historyController.getAllData);
router.post("/", historyController.toggleDevice);
module.exports = router;
