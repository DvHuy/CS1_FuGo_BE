import mongoose from "mongoose";

const StudysRecommendSchema  = new mongoose.Schema({
    accountId: {
        type: String,
        unique: true,
        required: true,
    },
    studyId: {
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

export default mongoose.model("StudysRecommend", StudysRecommendSchema );


