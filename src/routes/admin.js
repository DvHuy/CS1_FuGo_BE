import { Router } from "express";
import {adminController}  from "../controllers/adminController.js";
import { middlewareController } from "../middleware/middleware.js";

const router = Router();

// Get admin by account id
router.get("/:id", middlewareController.verifyTokenAndAdminAuth_GetAndDeleteAndUpdateAmin, adminController.getAdminByAccountId);

// Delete admin
router.delete("/delete/:id", middlewareController.verifyTokenAndAdminAuth_GetAndDeleteAndUpdateAmin, adminController.deleteAdmin);

// Insert admin info
router.post("/insert", middlewareController.verifyTokenAndAdminAuth_InsertAdmin, adminController.createAdmin);

// Update admin by account id 
router.post("/update/:id", middlewareController.verifyTokenAndAdminAuth_GetAndDeleteAndUpdateAmin, adminController.updateAdmin);

export default router;