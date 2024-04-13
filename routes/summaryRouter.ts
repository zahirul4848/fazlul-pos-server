import express from "express";
import { getDayWiseSales, getSummary } from "../controllers/summaryController";

const router = express.Router();

router.route("/").get(getSummary);
router.route("/daywisesales").get(getDayWiseSales);



export default router;