const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const usersControllers = require("../controllers/users-controller");
const checkAuth = require("../middleware/check-auth");

// Public Routes (No Authentication Required)
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);
router.get("/profile/:uid", usersControllers.getUserById);
router.post("/login", usersControllers.login);

// Apply Authentication Middleware for Routes Below This Line
router.use(checkAuth);

// Protected Routes (Authentication Required)
router.patch(
  "/profile/:uid",
  [check("name").not().isEmpty()],
  usersControllers.updateUser
);

module.exports = router;
