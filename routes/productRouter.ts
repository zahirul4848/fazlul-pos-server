import express from "express";
import {isAuth, isAdmin} from "../middleware/authMiddleware";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/productController";

const router = express.Router();

router.route("/").post(isAuth, isAdmin, createProduct).get(getAllProducts);
router.route("/:id").delete(isAuth, isAdmin, deleteProduct).put(isAuth, isAdmin, updateProduct).get(getProduct);


export default router;