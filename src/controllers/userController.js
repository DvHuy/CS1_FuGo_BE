import User from "../models/User.js";

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

export { getAllUsers, getSingleUser };
