const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUserProfile,
  logout,
  updateProfile,
} = require("../controller/user.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../utils/multer");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/logout").get(logout);
router
  .route("/profile/update")
  .put(isAuthenticated, upload.single("profilePhoto"), updateProfile);
module.exports = router;
