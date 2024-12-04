import express from "express";
import {jobController} from "../controllers/jobController.js"

//sau này import middleware

const router = express.Router();

//search job by conditions
router.get("/search/getJobBySearch", jobController.getJobBySearch);

// get all job
router.get("/",jobController.getAllJob);

// get single job
router.get("/:id",jobController.getSingleJob);

export default router;
