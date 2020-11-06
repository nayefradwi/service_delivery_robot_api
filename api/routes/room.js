const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../middleware/AdminMiddleware");
const AuthenticationMiddleware = require("../middleware/AuthenticationMiddleware");
const RoomController = require("../controllers/RoomController");
const RoomMiddleware = require("../middleware/RoomMiddleware");

router.get("/:roomId",AuthenticationMiddleware.authenticate, RoomController.getRoom);

router.put("/:roomId", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin,RoomMiddleware.getRoom ,RoomController.editRoom);

router.delete("/:roomId",AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, AdminMiddleware.isHighAdminAccess, RoomController.deleteRoom)

router.get("/map/:mapId",AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, RoomController.getListOfRoomsByMapId)
module.exports = router;