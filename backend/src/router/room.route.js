const express = require("express");
const router = express.Router();
const roomController = require("../controller/room.controller.js");

router.get("/", roomController.getAllRooms);

router.get("/:roomId", roomController.getRoomById);

router.post("/", roomController.createRoom);

router.patch("/:roomId", roomController.updateRoom);
router.delete("/:roomId/device/:deviceId", roomController.deleteDeviceFromRoom);

router.delete("/:roomId", roomController.deleteRoom);
module.exports = router;
