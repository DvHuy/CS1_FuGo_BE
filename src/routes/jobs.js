import express from "express";
import { getJobBySearch } from "../controllers/jobController.js";

//sau này import middleware

const router = express.Router();

router.get("/search/getJobBySearch", getJobBySearch);



export default router;
