const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../middleware/AdminMiddleware");
const AuthenticationMiddleware = require("../middleware/AuthenticationMiddleware");
const TaskController = require("../controllers/TaskController");
const RoomMiddleware = require("../middleware/RoomMiddleware");
const NurseMiddleware = require("../middleware/NurseMiddleware");
const TaskMiddleware = require("../middleware/TaskMiddleware");

//todo create another one for nurse, like /nurseTasks or just / and then authorizing that its a nurse

router.get(
  "/nurse",
  AuthenticationMiddleware.authenticate,
  NurseMiddleware.getNurse,
  TaskController.getTasksForNurse
);

router.post(
  "/:roomId",
  AuthenticationMiddleware.authenticate,
  RoomMiddleware.getRoom,
  RoomMiddleware.authorize,
  TaskController.createTask
);

router.delete(
  "/:taskId",
  AuthenticationMiddleware.authenticate,
  AdminMiddleware.getAdmin,
  AdminMiddleware.isHighAdminAccess,
  TaskController.deleteTask
);

router.delete(
  "/:taskId/nurse",
  AuthenticationMiddleware.authenticate,
  NurseMiddleware.getNurse,
  TaskController.deleteTaskNurse
);

router.get(
  "/",
  AuthenticationMiddleware.authenticate,
  TaskController.getTasksOfRoom
);

router.get(
  "/:taskId",

  AuthenticationMiddleware.authenticate,
  TaskController.getTask
);

router.post(
  "/:taskId/acceptance",
  AuthenticationMiddleware.authenticate,
  NurseMiddleware.getNurse,
  TaskMiddleware.getTask,
  TaskController.acceptTask
);
router.post(
  "/:taskId/confirmation",
  AuthenticationMiddleware.authenticate,
  TaskMiddleware.getTask,
  TaskController.confirmTask
);

// router.post("/nurse", AuthenticationMiddleware.authenticate, NurseMiddleware.getNurse, TaskController.createTask)

module.exports = router;
