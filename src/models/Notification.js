import mongoose from "mongoose";
import { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: String,
      required: true, // ID người dùng nhận thông báo
    },
    title: {
      type: String,
      required: true, // Tiêu đề ngắn gọn của thông báo
    },
    message: {
      type: String,
      required: true, // Nội dung chi tiết của thông báo
    },
    isRead: {
      type: Boolean,
      default: false, // Trạng thái đã đọc, mặc định là false
    },
    type: {
      type: String,
      enum: ["info", "warning", "error", "success"], // Loại thông báo
      default: "info",
    },
  },
  {
    timestamps: true, // Thêm createdAt và updatedAt tự động
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
