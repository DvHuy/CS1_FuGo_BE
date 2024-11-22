import { Router } from "express";
import { accountController } from "../controllers/accountController.js";
import { middlewareController } from "../middleware/middleware.js";
const router = Router();

// Get all account
router.get("/", middlewareController.verifyTokenAndAdminAuth_JustAdmin, accountController.getAllAccount);

// Delete account
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth_GetAndDeleteAndUpdateAmin, accountController.deleteAccount);
export default router;