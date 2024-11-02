import { Router } from "express";
import { partnerController } from "../controllers/partner.controller.js";
import { middlewareController } from "../controllers/middleware.controller.js";

const router = Router();

// Get all partner
router.get("/", middlewareController.verifyTokenAndAdminAuth_JustAdmin, partnerController.getAllPartner);

// Get user by account id
router.get('/:id', middlewareController.verifyTokenAndAdminAuth, partnerController.getPartnerByAccountId);

// Delete user 
router.delete("/delete/:id", middlewareController.verifyTokenAndAdminAuth, partnerController.deletePartner);

// Insert user 
router.post("/insert", middlewareController.verifyTokenAndCreateUserOrPartner, partnerController.insertPartner);

// Update user by account id 
router.post("/update/:id", middlewareController.verifyTokenAndAdminAuth, partnerController.updatePartner);

export default router;