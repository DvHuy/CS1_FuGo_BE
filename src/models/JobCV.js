import mongoose from "mongoose";
import { Schema } from "mongoose";

const jobCVSchema = new Schema({
  jobId: {
    type: String,
    required: true,
  },
  accountId:{
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  cv_img: {
    type: String,
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
