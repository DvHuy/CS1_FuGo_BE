import User from "../models/User.js";
import Account from "../models/Account.js";
import { encrypt, decrypt } from "../security/encryption.js";
import cloudinaryInstance from "cloudinary";
const cloudinary = cloudinaryInstance.v2;

export const userController = {
  // Get user by id
  getUserByAccountId: async (req, res) => {
    try {
      const user = await User.findOne({ accountId: req.params.accountId });
      const account = await Account.findOne({ _id: req.params.accountId });
      // console.log("account.email before: ", account.email);
      const decryptedAddress = decrypt(account.email);
      account.email = decryptedAddress;
      // console.log("account.email after: ", account.email);
      let accountEmail = account.email;
    
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      // Decrypt the address field before sending the response
      // const decryptedAddress = decrypt(account.email);
      // if(user.user_img){
      //     const decryptedUserImage = decrypt(user.user_img);
      //     user.user_img = decryptedUserImage;
      // }
      // user.address = decryptedAddress;

      return res.status(200).json({
        success: true,
        data: {
          username: user.username,
          email: accountEmail,
          birthday: user.birthday,
          phone: user.phone,
          gender: user.gender,
          bio: user.bio,
        },
      });
    } catch (error) {
      console.error("Error in getUserByAccountId:", error); // Thêm log lỗi chi tiết
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message, // Bao gồm message chi tiết
      });
    }
  },

  // Get all user
  getAllUser: async (req, res) => {
    try {
      const users = await User.find();
      if (!users || users.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No users found" });
      }

      // Decrypt the address field for each user
      const decryptedUsers = users.map((user) => {
        user.address = decrypt(user.address);
        user.user_img = decrypt(user.user_img);
        return user;
      });

      return res.status(200).json({ data: decryptedUsers });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // Delete user by account_id
  deleteUser: async (req, res) => {
    try {
      const user = await User.findOneAndDelete(req.params.account_id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Delete successfully!" });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // Insert User
  insertUser: async (req, res) => {
    let fileData;
    try {
      fileData = req.file;
      console.log(fileData);

      const {
        accountId,
        username,
        phone,
        birthday,
        gender,
        status_to_go,
        country,
        address,
        height,
        weight,
        bio,
      } = req.body;
      const user_img = fileData?.path;

      // creating a new User object
      const userData = {
        accountId,
        username,
        phone,
        birthday,
        gender,
        status_to_go,
        country,
        address,
        height,
        weight,
        bio,
        user_img,
      };

      const user = new User(userData);

      // saving the new User
      const savedUser = await user.save();

      return res.status(200).json({
        success: true,
        data: savedUser,
      });
    } catch (error) {
      console.error({
        success: false,
        data: error,
        message: "Error inserting user",
      });

      // Delete the image from Cloudinary if there was an error
      if (fileData && fileData.filename) {
        await cloudinary.uploader.destroy(fileData.filename);
      }

      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // Update user
  updateUser: async (req, res) => {
    let fileData;
    try {
      fileData = req.file;
      console.log(fileData);

      const {
        username,
        phone,
        birthday,
        gender,
        status_to_go,
        country,
        address,
        height,
        weight,
        bio,
      } = req.body;
      // Find the user by ID
      const user = await User.findOne({ accountId: req.params.accountId });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      // Update the user's information
      if (username !== undefined) user.username = username;
      if (phone !== undefined) user.phone = phone;
      if (birthday !== undefined) user.birthday = birthday;
      if (gender !== undefined) user.gender = gender;
      if (status_to_go !== undefined) user.status_to_go = status_to_go;
      if (country !== undefined) user.country = country;
      if (address !== undefined) user.address = address;
      if (height !== undefined) user.height = height;
      if (weight !== undefined) user.weight = weight;
      if (bio !== undefined) user.bio = bio;
      if (fileData?.path) user.user_img = fileData.path;
      // Save the updated user
      const updatedUser = await user.save();
      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      // Delete the image from Cloudinary if there was an error
      if (fileData && fileData.filename) {
        await cloudinary.uploader.destroy(fileData.filename);
      }
      return res.status(500).json(error);
    }
  },
};
