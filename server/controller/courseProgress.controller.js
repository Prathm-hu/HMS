const Course = require("../models/course.model");
const CourseProgress = require("../models/courseProgress");

exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const userId = req.id;
    // step 1 fetch the user course progress
    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");

    if (!courseProgress) {
      return res.status(200).json({
        data: { courseDetails, progress: [], completed: false },
      });
    }
    // step 2 if no progress found return course details with an empty progress
    if (!courseProgress) {
      return res.status(404).json({
        data: { courseDetails, progress: [], completed: false },
      });
    }
    // step 3 return the users course progress along with course details
    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error getting course progress",
      success: false,
    });
  }
};

exports.updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;
    const { progress } = req.body;
    // step 1 fetch or create course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      courseProgress = new CourseProgress({
        courseId,
        userId,
        completed: false,
        lectureProgress: [],
      });
    }
    // find the lecture progress in the course progressF
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId == lectureId
    );
    if (lectureIndex !== -1) {
      // if lecture already exits ,update its progress
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      // add new lecture progress
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }
    // if all lecture is completed
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lectureProg) => lectureProg.viewed
    ).length;
    const course = await Course.findById(courseId);
    if (course.lectures.length === lectureProgressLength)
      courseProgress.completed = true;

    await courseProgress.save();
    return res
      .status(200)
      .json({ message: "Lecture progress updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error updating lecture progress",
      success: false,
    });
  }
};

exports.markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    // step 1 fetch or create course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      // courseProgress = new CourseProgress({
      //   courseId,
      //   userId,
      //   completed: false,
      //   lectureProgress: [],
      // });
      return res.status(404).json({ message: "Course progress not found" });
    }
    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = true)
    );
    courseProgress.completed = true;
    await courseProgress.save();
    return res
      .status(200)
      .json({ message: "Course marked as completed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error marking course as completed",
      success: false,
    });
  }
};

exports.markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    // step 1 fetch or create course progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      // courseProgress = new CourseProgress({
      //   courseId,
      //   userId,
      //   completed: false,
      //   lectureProgress: [],
      // });
      return res.status(404).json({ message: "Course progress not found" });
    }
    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = false)
    );
    courseProgress.completed = false;
    await courseProgress.save();
    return res
      .status(200)
      .json({ message: "Course marked as completed Incompleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error marking course as completed",
      success: false,
    });
  }
};
