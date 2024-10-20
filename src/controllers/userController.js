import User from "../models/User.js";

// Lưu thông tin người dùng, còn chỉnh sửa chưa xong
const createUser = async (req, res) => {
  const { fullName, birthday, skills, description, country, userImg } =
    req.body;

  try {
    const newUser = new User({
      fullName,
      birthday,
      skills,
      description,
      country,
      userImg,
    });
    const savedUser = await newUser.save();

    res.status(200).json({
      success: true,
      message: "Successfully created",
      data: savedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create. Try again",
    });
  }
};

// Lấy ra thông tin của tất cả user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    // const users = await User.find({}).populate('accountId');  Xài khi có bảng Account
    res.status(200).json({
      success: true,
      data: users,
      message: "Get all users successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy ra thông tin của 1 user xác định bởi id
const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    //   const user = await User.findById(id).populate('accountId'); Xài khi đã có bảng Account
    res.status(200).json({
      success: true,
      message: "Successfully get single User",
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  }
};

// Cập nhật thông tin User
const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Updated User Successfully",
      data: updateUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update",
    });
  }
};

// delete User
const deleteUser = async (req,res) => {
  const id = req.params.id
  
  try {
      
      const deletedUser = await User.findByIdAndDelete(id);

      res.status(200)
      .json({
          success: true,
          message: "Successfully deleted",
      });
  } catch (error) {
      res.status(500 )
      .json({
          success: false,
          message: "Failed to delete",
      });
  }
};

export { createUser ,getAllUsers, getSingleUser, updateUser, deleteUser };
