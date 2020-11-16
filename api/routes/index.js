const express = require("express");
const router = express.Router();
const RoomController = require("../controllers/RoomController")
const NurseController = require("../controllers/NurseController");
const AdminController = require("../controllers/AdminController");
const AdminMiddleware = require("../middleware/AdminMiddleware");
const AuthenticationMiddleware = require("../middleware/AuthenticationMiddleware")
const AuthenticationController = require("../controllers/AuthenticationController")

router.post("/login/admin", AdminController.login)
router.post("/login/room", RoomController.login)

router.post("/login/nurse", NurseController.login)



router.get("/authentication", AuthenticationController.authenticate)

//requires admin access
router.post("/register/nurse", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, NurseController.register);
//requires admin access
router.post("/register/room", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, RoomController.register);


//requires high admin access
router.post("/register/admin", AuthenticationMiddleware.authenticate,AdminMiddleware.getAdmin,AdminMiddleware.isHighAdminAccess,AdminController.register)


module.exports = router;