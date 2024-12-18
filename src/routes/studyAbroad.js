import express from 'express'
import { createStudy, updateStudy, deleteStudy, getSingleStudy, getAllStudy } from '../controllers/studyController.js';
import {  verifyAdmin, verifyUser, verifyPartner  } from '../utils/verifyToken.js';

const router = express.Router()

// create new tour
router.post("/", createStudy);

// update tour
router.put("/:id", verifyPartner, updateStudy);

// delete tour
router.delete("/:id", verifyPartner, deleteStudy);

// get single tour
router.get("/:id",verifyUser, getSingleStudy);

// get all tours
router.get("/", getAllStudy);

export default router;