import { Router } from "express";
import { partnerController } from "../controllers/partnerController.js";
import { middlewareController } from "../middleware/middleware.js"

const router = Router();

// Get all partner
router.get("/", middlewareController.verifyTokenAndAdminAuth_JustAdmin, partnerController.getAllPartner);

// Get user by account id
router.get('/:id', middlewareController.verifyTokenAndAdminAuth, partnerController.getPartnerByAccountId);

// Delete user 
router.delete("/delete/:id", middlewareController.verifyTokenAndAdminAuth, partnerController.deletePartner);

// Insert user 
// router.post("/insert", middlewareController.verifyTokenAndCreateUserOrPartner, partnerController.insertPartner);

// Update user by account id 
router.post("/update/:id", middlewareController.verifyTokenAndAdminAuth, partnerController.updatePartner);

// Get the list job that a partner has posted
router.post("/job/view", partnerController.getListPostedJobs);

//Get the list of CV apply in a job
router.post("/job/view/detail", partnerController.getListJobCVs);

//Get candidate information 
router.post("/job/view/detail/candidate", partnerController.getJobDetailCV);

export default router;