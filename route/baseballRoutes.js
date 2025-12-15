import express from "express";
import {
    getBaseballSeries,
    getBaseballSets,
    getBaseballCards,
} from "../controller/baseballController.js";

const router = express.Router();

router.get("/series", getBaseballSeries);
router.get("/sets", getBaseballSets);
router.get("/cards", getBaseballCards);

export default router;
