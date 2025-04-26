const express = require("express");
const router = express.Router();

const appointmentControllers = require("../controllers/appointment-controller");
const checkAuth = require("../middleware/check-auth");

// Public Routes (No Authentication Required)

// Apply Authentication Middleware for Routes Below This Line
router.use(checkAuth);

// Protected Routes (Authentication Required)
router.post("/", appointmentControllers.createAppointment);
router.get("/", appointmentControllers.getAllAppointments);
router.get("/:aid", appointmentControllers.getAppointmentById);
router.patch("/:aid", appointmentControllers.updateAppointment);
router.delete("/:aid", appointmentControllers.deleteAppointment);

module.exports = router;
