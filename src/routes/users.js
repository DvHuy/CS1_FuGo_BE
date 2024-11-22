import { Router } from "express";
import { middlewareController } from "../middleware/middleware.js";
import { userController } from "../controllers/userController.js";
import {uploadCloud} from "../middleware/cloudinary.js";

const router = Router();

// Get all user
router.get("/", middlewareController.verifyTokenAndAdminAuth_JustAdmin, userController.getAllUser);

// Get user by account id
router.get("/:accountId", middlewareController.verifyTokenAndCreateAndUpdateUserOrPartnerInfo, userController.getUserByAccountId);

// Delete user 
router.delete("/delete/:accountId", middlewareController.verifyTokenAndAdminAuth, userController.deleteUser);

// Insert user 
router.post("/insert", middlewareController.verifyTokenAndCreateAndUpdateUserOrPartnerInfo, uploadCloud.single('user_img'), userController.insertUser);

// Update user by account id 
router.post("/update/:accountId", middlewareController.verifyTokenAndCreateAndUpdateUserOrPartnerInfo, uploadCloud.single('user_img'), userController.updateUser);

export default router;