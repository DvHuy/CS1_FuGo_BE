import { Router } from "express";
import { authController } from "../controllers/authController.js";
import { middlewareController } from "../middleware/middleware.js";


const router = Router();

//Register
router.post("/register", authController.registerAccount);

//Login
router.post("/login", authController.loginAccount);

// Refresh token 
router.post("/refresh", authController.requestRefreshToken);

// Logout 
router.post("/logout", middlewareController.verifyToken, authController.logoutAccount);
export default router;