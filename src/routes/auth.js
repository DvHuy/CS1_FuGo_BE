import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { middlewareController } from "../middleware/middleware.js";
import { forgotPasswordController } from "../controllers/forgotPasswordController.js"


const router = Router();

//Register
router.post("/register", authController.registerAccount);

// Verify
router.get("/verify", authController.verify);

//Login
router.post("/login", authController.loginAccount);

// Refresh token 
router.post("/refresh", authController.requestRefreshToken);

// Logout 
router.post("/logout", middlewareController.verifyToken, authController.logoutAccount);

// Forgot password 
router.post("/password/email", forgotPasswordController.sendResetLinkEmail);
router.get("/password/formReset", forgotPasswordController.showFormResetPassword);
router.post("/password/reset", forgotPasswordController.resetPassword);
export default router;