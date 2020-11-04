const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../middleware/AdminMiddleware");
const AuthenticationMiddleware = require("../middleware/AuthenticationMiddleware");
const RoomController = require("../controllers/RoomController");

router.get("/:roomId",AuthenticationMiddleware.authenticate,)

module.exports = router;