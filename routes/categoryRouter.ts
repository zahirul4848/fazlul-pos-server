import express from "express";
import {isAuth, isAdmin} from "../middleware/authMiddleware";
import { createCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from "../controllers/categoryController";

const router = express.Router();

router.route("/").post(isAuth, isAdmin, createCategory).get(getAllCategory);
router.route("/:id").delete(isAuth, isAdmin, deleteCategory).put(isAuth, isAdmin, updateCategory).get(isAuth, isAdmin, getCategory);


export default router;