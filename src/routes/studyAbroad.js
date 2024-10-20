import express from 'express'
import { createStudy, updateStudy, deleteStudy, getSingleStudy, getAllStudy } from '../controllers/studyController.js';
import {  verifyAdmin, verifyUser  } from '../utils/verifyToken.js';

const router = express.Router()

// create new tour
router.post("/", verifyAdmin, createStudy);

// update tour
router.put("/:id", verifyAdmin, updateStudy);

// delete tour
router.delete("/:id", verifyAdmin, deleteStudy);

// get single tour
router.get("/:id",verifyUser, getSingleStudy);

// get all tours
router.get("/", getAllStudy);

export default router;