import express from "express";
import { getJobBySearch, createJobs, updateJobs, deleteJobs, getAllJobs } from "../controllers/jobController.js";
import {  verifyAdmin, verifyUser  } from '../utils/verifyToken.js';

//sau này import middleware

const router = express.Router();

router.get("/search/getJobBySearch", getJobBySearch);

// create new tour
router.post("/", verifyAdmin, createJobs);

// update tour
router.put("/:id", verifyAdmin, updateJobs);

// delete tour
router.delete("/:id", verifyAdmin, deleteJobs);


// get all tours
router.get("/",getAllJobs);

export default router;
