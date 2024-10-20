import mongoose from "mongoose";
import { Schema } from "mongoose";

const studyAbroadSchema = new Schema({
    title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      requirements: {
        type: String,
        required: true,
      },
      duration: {
          type: String,
          required: true,
      },
      location: {
          type: String,
          required: true,
      },
      // cv_apply: {
      //     type: mongoose.Types.ObjectId,
      //     ref: "Study_abroad_CVs"
      // },
      createdAt: {
          type: Date,
          default: Date.now,
      },
        updatedAt: {
          type: Date,
          default: Date.now,
      },
});

const StudyAbroad = mongoose.model("StudyAbroad", studyAbroadSchema);

export default StudyAbroad;
