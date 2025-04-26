const express = require("express");
const router = express.Router();

const dentistsControllers = require("../controllers/dentist-controller");
const checkAuth = require("../middleware/check-auth");

// Public Routes (No Authentication Required)
router.get("/", dentistsControllers.getAllDentists);
router.get("/:did", dentistsControllers.getDentistById);
router.patch("/:did", dentistsControllers.updateDentist);
router.delete("/:did", dentistsControllers.deleteDentist);

// Apply Authentication Middleware for Routes Below This Line
router.use(checkAuth);

// Protected Routes (Authentication Required)
router.post("/", dentistsControllers.createDentist);

module.exports = router;
