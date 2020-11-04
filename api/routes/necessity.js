const express = require("express");
const router = express.Router();
const AdminMiddleware = require("../middleware/AdminMiddleware");
const AuthenticationMiddleware = require("../middleware/AuthenticationMiddleware");
const NecessityController = require("../controllers/NecessityController");
router.post("/", AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, NecessityController.createNecessity)
router.delete("/:id",AuthenticationMiddleware.authenticate, AdminMiddleware.getAdmin, NecessityController.delete)
router.get("/", AuthenticationMiddleware.authenticate,NecessityController.getNecessities )
module.exports = router;