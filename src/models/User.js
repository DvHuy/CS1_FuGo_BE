import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  // accountId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Account",
  //   required: true, 
  // },
  accountId: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    maxlength: 50,
    sparse: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  status_to_go: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  user_img: {
    type: String,
    sparse: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model("User", UserSchema);


