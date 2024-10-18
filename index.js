import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./src/db/connectToMongoDB.js";
import userRouter from "./src/routes/users.js";
import jobRouter from "./src/routes/jobs.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

//test api
app.get("/", (req, res) => {
  res.send("api working");
});

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// API
// API for user
app.use("/api/users", userRouter);

//API for Job
app.use("/api/jobs", jobRouter);

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
