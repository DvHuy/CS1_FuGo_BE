import mongoose from "mongoose";
import { Schema } from "mongoose";

const jobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  requirements: {
    type: String,
  },
  country: {
    type: String,
  },
  location: {
    type: String,
  },
  company: {
    type: String,
  },
  experience: {
    type: String,
  },
  profession: {
    type: String,
  },
  educationalLevel: {
    type: String,
  },
  jobStatus: {
    type: String,
  },
  minSalary: {
    type: String,
  },
  maxSalary: {
    type: String,
  },
  cvApply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job_CVs", // Ensure this references the correct Job_CVs model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
