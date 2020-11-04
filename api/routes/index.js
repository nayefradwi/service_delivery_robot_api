const express = require("express");
const router = express.Router();
const RoomController = require("../controllers/RoomController")
const NurseController = require("../controllers/NurseController");
const AdminController = require("../controllers/AdminController");
const AdminMiddleware = require("../middleware/AdminMiddleware");
const AuthenticationMiddleware = require("../middleware/AuthenticationMiddleware")

router.post("/login/room", RoomController.login)

router.post("/login/nurse", NurseController.login)


router.post("/login/admin", AdminController.login)

//requires admin access
router.post("/register/nurse")
//requires admin access
router.post("/register/room")


//requires high admin access
router.post("/register/admin", AuthenticationMiddleware.authenticate,AdminMiddleware.getAdmin,AdminMiddleware.isHighAdminAccess,AdminController.register)


module.exports = router;