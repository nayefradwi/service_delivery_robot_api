const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../middleware/AdminMiddleware");
const AuthenticationMiddleware = require("../middleware/AuthenticationMiddleware")
const NurseController = require("../controllers/NurseController");
const NurseMiddleware = require("../middleware/NurseMiddleware");

router.get("/:nurseId", AuthenticationMiddleware.authenticate, NurseController.getNurseByObjectId);

router.put("/:nurseId", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, NurseMiddleware.getNurse, NurseController.edit);

router.get("/hospital/:hospitalId", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, NurseController.getNursesByHospitalId);

router.delete("/:nurseId", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, AdminMiddleware.isHighAdminAccess, NurseController.delete)

module.exports = router;