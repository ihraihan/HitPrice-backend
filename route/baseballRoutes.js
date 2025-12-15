import express from "express";
import {
    getBaseballCategories,
    getBaseballCards,
} from "../controller/baseballController.js";

const router = express.Router();

router.get("/categories", getBaseballCategories);
router.get("/cards", getBaseballCards);

export default router;
