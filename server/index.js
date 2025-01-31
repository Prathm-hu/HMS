const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./database/dbConnect");
const userRoute = require("./routes/user.route");
const courseRoute = require("./routes/course.route");
const mediaRoute = require("./routes/media.route");
const purchaseRoute = require("./routes/purchaseCourse.route");
const CourseProgressRoute = require("./routes/courseProgress.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config({});
const app = express();
// connect to database
connectDb();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/course-progress", CourseProgressRoute);
app.listen(process.env.PORT, () => {
  console.log("Server is running on port 8080");
});
