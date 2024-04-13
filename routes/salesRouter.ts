import express from "express";
import {isAuth, isAdmin} from "../middleware/authMiddleware";
import { createSale, deleteSale, getAllSales, getSale, dueAdjustment } from "../controllers/salesController";

const router = express.Router();

router.route("/").post(isAuth, isAdmin, createSale).get(isAuth, isAdmin, getAllSales);
router.route("/adjustment/:id").put(isAuth, isAdmin, dueAdjustment);
router.route("/:id").delete(isAuth, isAdmin, deleteSale).get(isAuth, isAdmin, getSale);


export default router;