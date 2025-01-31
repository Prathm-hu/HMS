const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  getCourseProgress,
  updateLectureProgress,
  markAsCompleted,
  markAsInCompleted,
} = require("../controller/courseProgress.controller");

const router = express.Router();

router.route("/:courseId").get(isAuthenticated, getCourseProgress);

router
  .route("/:courseId/lecture/:lectureId/view")
  .post(isAuthenticated, updateLectureProgress);

router.route("/:courseId/complete").post(isAuthenticated, markAsCompleted);
router.route("/:courseId/incomplete").post(isAuthenticated, markAsInCompleted);

module.exports = router;
