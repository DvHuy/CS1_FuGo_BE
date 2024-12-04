import { Router } from "express";
import { partnerController } from "../controllers/partnercontroller.js";
import { middlewareController } from "../middleware/middleware.js";

const router = Router();

// Get all partner
router.get("/", middlewareController.verifyTokenAndAdminAuth_JustAdmin, partnerController.getAllPartner);

// Get user by account id
router.get('/:id', middlewareController.verifyTokenAndAdminAuth, partnerController.getPartnerByAccountId);

// Delete user 
router.delete("/delete/:id", middlewareController.verifyTokenAndAdminAuth, partnerController.deletePartner);

// Insert user 
router.post("/insert", middlewareController.verifyTokenAndCreateAndUpdateUserOrPartnerInfo, partnerController.insertPartner);

// Update user by account id 
router.post("/update/:id", middlewareController.verifyTokenAndAdminAuth, partnerController.updatePartner);

export default router;