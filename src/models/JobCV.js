import mongoose from "mongoose";
import { Schema } from "mongoose";

const jobCVSchema = new Schema({
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  certificate: {
    type: String,
    required: true,
  },
  major: {
    type: String,
    required: true,
  },
  gpa: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cv_img: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const JobCV = mongoose.model("JobCV", jobCVSchema);

export default JobCV;
