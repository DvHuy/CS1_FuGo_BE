import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUser,
} from "../controllers/userController.js";
//sau này import middleware

const router = express.Router();

//get all users
router.get("/", getAllUsers);

//get single user
router.get("/:id", getSingleUser);

//update user
router.put("/:id", updateUser);

export default router;
