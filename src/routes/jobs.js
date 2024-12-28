import express from "express";
import {applyJobCV, jobController, upload} from "../controllers/jobController.js"
import {uploadCloud} from "../middleware/cloudinary.js";
import { middlewareController } from "../middleware/middleware.js";
//sau này import middleware

const router = express.Router();

//search job by conditions
router.post("/search/getJobBySearch", jobController.getJobBySearch);

// get all job by page
router.get("/",jobController.getAllJobPage);

// get all job
router.get("/all",jobController.getAllJob);

// get single job
router.get("/:id",jobController.getSingleJob);

//apply CV
router.post("/apply", upload.single("image"), applyJobCV);

// create new job
router.post("/insert" , middlewareController.verifyTokenAndAllowJobCreation , uploadCloud.single('image'), jobController.insertJob);
// router.post("/insert" , uploadCloud.single('image'), jobController.insertJob);
// create new job
router.put("/update/:jobId" , middlewareController.verifyTokenAndAllowJobCreation, uploadCloud.single('image'), jobController.updateJob);

export default router;
