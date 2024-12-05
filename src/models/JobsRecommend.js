import mongoose from "mongoose";

const JobsRecommendSchema  = new mongoose.Schema({
    accountId: {
        type: String,
        unique: true,
        required: true,
    },
    jobId: {
        type: [String],
        unique: true,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
})

export default mongoose.model("JobsRecommend", JobsRecommendSchema );


