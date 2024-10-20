import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./src/db/connectToMongoDB.js";

import userRouter from "./src/routes/users.js";
import jobRouter from "./src/routes/jobs.js";
import authRouter from "./src/routes/auth.js"
import studyRouter from "./src/routes/studyAbroad.js"



dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
const corsOptions = {
  origin: true,
  credentials: true
}

//test api
app.get("/", (req, res) => {
  res.send("api working");
});

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// API for auth
app.use("/api/v1/auth", authRouter);

// API for user
app.use("/api/v1/users", userRouter);

//API for Job
app.use("/api/v1/jobs", jobRouter);

//API for study
app.use("/api/v1/study", studyRouter);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
