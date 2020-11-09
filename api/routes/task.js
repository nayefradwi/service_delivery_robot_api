const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../middleware/AdminMiddleware");
const AuthenticationMiddleware = require("../middleware/AuthenticationMiddleware");
const TaskController = require("../controllers/TaskController");
const RoomMiddleware = require("../middleware/RoomMiddleware")
const NurseMiddleware = require("../middleware/NurseMiddleware")
const TaskMiddleware = require("../middleware/TaskMiddleware")

//todo create another one for nurse, like /nurseTasks or just / and then authorizing that its a nurse
router.post("/:roomId", AuthenticationMiddleware.authenticate, RoomMiddleware.getRoom, RoomMiddleware.authorize, TaskController.createTask)

router.delete("/:taskId", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, AdminMiddleware.isHighAdminAccess, TaskController.deleteTask)

router.get("/", AuthenticationMiddleware.authenticate, TaskController.getTasksOfRoom)

router.get("/:taskId",AuthenticationMiddleware.authenticate, TaskController.getTask)

router.post("/:taskId/acceptance", AuthenticationMiddleware.authenticate, NurseMiddleware.getNurse, TaskMiddleware.getTask, TaskController.acceptTask)

module.exports = router;