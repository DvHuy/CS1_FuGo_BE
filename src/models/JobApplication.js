import mongoose from "mongoose";
import { Schema } from "mongoose";

const jobApplicationSchema = new Schema(
  {
    job_cv_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobCV",
      required: true,
    },
    status: {
      type: String,
      enum: ["Đang duyệt", "Chấp nhận", "Từ chối"],
      default: "Đang duyệt",
    },
  },
  {
    timestamps: true, 
  }
);

const JobApplication = mongoose.model("jobApplication", jobApplicationSchema);

export default JobApplication;
