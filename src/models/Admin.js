import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  accountId: {
    type: String,
    unique: true,
    required: true,
  },
  full_name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default : "Activity"
  },
  last_login: {
    type: String,
    sparse: true,
  }
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model("Admin", AdminSchema);