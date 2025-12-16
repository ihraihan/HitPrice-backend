import express from "express";
import {
    getBaseballSeries,
    getBaseballSets,
    getCardsByBrand,
} from "../controller/baseballController.js";

const router = express.Router();

router.get("/series", getBaseballSeries);
router.get("/sets", getBaseballSets);
router.get("/cards", getCardsByBrand);

export default router;
