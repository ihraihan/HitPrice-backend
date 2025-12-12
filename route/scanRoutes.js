import express from "express";
import { scanCard } from "../controller/scanController.js";

const router = express.Router();

router.post("/", scanCard);

export default router;
