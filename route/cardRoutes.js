import express from "express";
import { lookupCard } from "../controller/cardController.js";

const router = express.Router();
router.post("/lookup", lookupCard);

export default router;
