import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./src/db/connectToMongoDB.js";

import authRouter from "./src/routes/auth.js"
import partnerRouter from "./src/routes/partner.js";
import userRouter from "./src/routes/users.js";
import adminRouter from "./src/routes/admin.js";

import jobRouter from "./src/routes/jobs.js";
import studyRouter from "./src/routes/studyAbroad.js"
import jobsRecommendRouter from "./src/routes/jobsRecommend.js";
import studysRecommendRouter from "./src/routes/studysRecommend.js";







dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static("src/public/uploadCV"));


// API for auth
app.use("/api/v1/auth", authRouter);

// API for user
app.use("/api/v1/users", userRouter);


 // API for admin
app.use("/api/v1/admin", adminRouter);
//API for partner
app.use("/api/v1/partners", partnerRouter);


//API for Job
app.use("/api/v1/jobs", jobRouter);

//API for Job Recommend
app.use("/api/v1/jobsRecommend", jobsRecommendRouter);

//API for study Recommend
app.use("/api/v1/studysRecommend", studysRecommendRouter);

//API for study
app.use("/api/v1/study", studyRouter);


app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
