import { Router } from "express";
import { JobsRecommendController } from "../controllers/jobsRecommendController.js";

const router = Router();

// Insert jobs recommend
router.post("/insert", JobsRecommendController.insertJobsRecommend);

// Get recommend jobs 
router.get("/", JobsRecommendController.getJobsRecommend);
export default router;