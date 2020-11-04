const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../middleware/AdminMiddleware");
const AuthenticationMiddleware = require("../middleware/AuthenticationMiddleware")
const HospitalController = require("../controllers/HospitalController")
const HospitalMiddleware = require("../middleware/HospitalMiddleware")

router.post("/", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, HospitalController.createHospital);

router.get("/:hospitalId", AuthenticationMiddleware.authenticate, HospitalController.getHospital);

router.put("/:hospitalId", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, HospitalMiddleware.getHospital, HospitalController.editHospital);

router.get("/",AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, HospitalController.getListOfHospitals);

router.delete("/:hospitalId", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, AdminMiddleware.isHighAdminAccess, HospitalController.delete)

module.exports = router;