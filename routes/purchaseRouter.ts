import express from "express";
import {isAuth, isAdmin} from "../middleware/authMiddleware";
import { createPurchase, deletePurchase, getAllPurchase, updatePurchase } from "../controllers/purchaseController";

const router = express.Router();

router.route("/").post(isAuth, isAdmin, createPurchase).get(getAllPurchase);
router.route("/:id").delete(isAuth, isAdmin, deletePurchase).put(isAuth, isAdmin, updatePurchase);


export default router;