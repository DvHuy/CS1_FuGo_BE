import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  verify : {
    type : Date,
  }
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model("Account", AccountSchema);
