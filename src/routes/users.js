import express from "express";
import {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

//sau này import middleware

const router = express.Router();

// create user
router.get("/", createUser);

//get all users
router.get("/", getAllUsers);

//get single user
router.get("/:id", getSingleUser);

//update user
router.put("/:id", updateUser);

// delete user
router.delete("/:id", verifyUser, deleteUser);

export default router;
