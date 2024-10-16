import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true, // Bắt buộc phải có accountId
    },
    birthday: {
      type: String,
      required: true, // Bắt buộc phải có ngày sinh
    },
    skills: {
      type: String,
      trim: true, // Loại bỏ khoảng trắng thừa
    },
    description: {
      type: String,
      trim: true, // Loại bỏ khoảng trắng thừa
    },
    country: {
      type: String,
      trim: true, // Loại bỏ khoảng trắng thừa
    },
    height: {
      type: String,
    },
    weight: {
      type: String,
    },
    userImg: {
      type: String, // Đường dẫn tới hình ảnh của người dùng
    },
    jobCvId: {
      type: Schema.Types.ObjectId,
      ref: "JobCV", // Liên kết tới bảng JobCV
    },
    studyAbroadCvId: {
      type: Schema.Types.ObjectId,
      ref: "StudyAbroadCV", // Liên kết tới bảng StudyAbroadCV
    },
    createdAt: {
      type: Date,
      default: Date.now, // Tự động đặt giá trị là ngày hiện tại
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Tự động đặt giá trị là ngày hiện tại
    },
  },
  {
    timestamps: true, // Tự động tạo các trường `createdAt` và `updatedAt`
    versionKey: false, // Vô hiệu hóa trường `__v` của MongoDB
  }
);

const User = mongoose.model("User", userSchema);

export default User;
