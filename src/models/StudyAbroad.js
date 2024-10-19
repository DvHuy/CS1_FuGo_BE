import mongoose from "mongoose";
import { Schema } from "mongoose";

const studyAbroadSchema = new Schema({});

const StudyAbroad = mongoose.model("StudyAbroad", studyAbroadSchema);

export default StudyAbroad;
