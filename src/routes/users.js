import express from "express";
import { getAllUsers, getSingleUser } from "../controllers/userController.js";
//sau này import middleware

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getSingleUser);

export default router;
