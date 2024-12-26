import { Router } from "express";
import { JobsRecommendController } from "../controllers/jobsRecommendController.js";
import { middlewareController } from "../middleware/middleware.js";

const router = Router();

// Insert jobs recommend
router.post("/insert", middlewareController.verifyTokenAndRateLimitInsert, JobsRecommendController.insertJobsRecommend);

// Get recommend jobs 
router.get("/:accountId", JobsRecommendController.getJobsRecommend);
export default router;