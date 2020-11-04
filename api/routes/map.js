const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../middleware/AdminMiddleware");
const AuthenticationMiddleware = require("../middleware/AuthenticationMiddleware");
const MapController = require("../controllers/MapController");
const MapMiddleware = require("../middleware/MapMiddleware");

router.post("/",AuthenticationMiddleware.authenticate,AdminMiddleware.getAdmin, MapController.createMap)
router.get("/:mapId",AuthenticationMiddleware.authenticate, MapController.getMap)
router.put("/:mapId", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, MapMiddleware.getMap,MapController.editMap)
router.delete("/:mapId", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, AdminMiddleware.isHighAdminAccess, MapController.deleteMap)
router.get("/hospital/:hospitalId",AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, MapController.getListOfMaps)
module.exports = router;