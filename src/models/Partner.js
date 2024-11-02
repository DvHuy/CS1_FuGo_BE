import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema({
  accountId: {
    type: String,
    unique: true,
    required: true,
  },
  company_name: {
    type: String,
    maxlength: 100,
    required: true,
  },
  contact_person: {
    type: String,
    required: true,
  },
  contact_phone_person: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model("Partner", PartnerSchema);