import mongoose from "mongoose";
import { Schema } from "mongoose";
const UserSchema = new mongoose.Schema({
  accountId: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true, 
  },
  // accountId: {
  //   type: String,
  //   unique: true,
  //   required: true,
  // },
  username: {
    type: String,
    maxlength: 50,
    sparse: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  status_to_go: {
    type: String,
    default: "Available",
  },
  country: {
    type: String,
    default: "Vietnam",
  },
  address: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    maxlength: 10,
    default: null,
  },
  weight: {
    type: String,
    maxlength: 10,
    default: null,
  },
  bio: {
    type: String,
    maxlength: 100,
    default: null,
  },  
  user_img: {
    type: String,
    default: "default.jpg",
  },
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model("User", UserSchema);


