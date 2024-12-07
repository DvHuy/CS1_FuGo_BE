import express from "express";
import {applyJobCV, jobController, upload} from "../controllers/jobController.js"

//sau này import middleware

const router = express.Router();

//search job by conditions
router.post("/search/getJobBySearch", jobController.getJobBySearch);

// get all job
router.get("/",jobController.getAllJobs);

// get single job
router.get("/:id",jobController.getSingleJob);

//apply CV
router.post("/apply", upload.single("image"), applyJobCV);

export default router;
