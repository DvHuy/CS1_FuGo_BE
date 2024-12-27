import express from 'express'
import { createStudy, updateStudy, deleteStudy, getSingleStudy, getAllStudy, getAllStudyPage} from '../controllers/studyController.js';
import {  verifyAdmin, verifyUser, verifyPartner  } from '../utils/verifyToken.js';

const router = express.Router()

// create new tour
router.post("/", createStudy);

// get all tours
router.get("/all", getAllStudy);

// update tour
router.put("/:id", verifyPartner, updateStudy);

// delete tour
router.delete("/:id", verifyPartner, deleteStudy);

// get single tour
router.get("/:id", getSingleStudy);

// get all tours by page
router.get("/", getAllStudyPage);

export default router;