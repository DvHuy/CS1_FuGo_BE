import { Router } from "express";
import { StudysRecommendController } from "../controllers/studysRecommendController.js";
import { middlewareController } from "../middleware/middleware.js";

const router = Router();

// Insert jobs recommend
router.post("/insert", middlewareController.verifyTokenAndRateLimitInsert, StudysRecommendController.insertStudysRecommend);

// Get recommend jobs 
router.get("/", StudysRecommendController.getStudysRecommend);
export default router;