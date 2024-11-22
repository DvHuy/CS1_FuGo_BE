import mongoose from "mongoose";
import {Schema} from "mongoose";

const jobApplicationSchema = new Schema({
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    job_cv_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobCV",
        required: true,
    },
    status:{
        type: String,
        enum: ["Pending", "Accepted", "Declined"],
        default: "Pending"
    },
    applied_at: {
        type: Date,
        default: Date.now,
    }
})

const JobApplication = mongoose.model("jobApplication", jobApplicationSchema)

export default JobApplication;