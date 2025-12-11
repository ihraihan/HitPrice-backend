// routes/scanRoutes.js
import express from "express";
import { scanHandler } from "../controllers/scanController.js";

const router = express.Router();
router.post("/scan", scanHandler);

export default router;
