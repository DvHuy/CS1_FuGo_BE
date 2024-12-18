import mongoose from "mongoose";
import { Schema } from "mongoose";

const studyAbroadSchema = new Schema({
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
    duration: {
        type: String,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
        default: "Vietnam",
    },
    partner_name: {
        type: String,
    },
    partner_phone: {
        type: String,
    },
    partner_email: {
        type: String,
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        default: "Available",
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

const StudyAbroad = mongoose.model("StudyAbroad", studyAbroadSchema);

export default StudyAbroad;
