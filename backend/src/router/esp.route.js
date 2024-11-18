const express = require("express");
const router = express.Router();
const espController = require("../controller/esp.controller");

// Route để lấy danh sách tất cả ESPs
router.get("/", espController.getAllESPs);

// Route để tạo một ESP mới
router.post("/", espController.createESP);

module.exports = router;
