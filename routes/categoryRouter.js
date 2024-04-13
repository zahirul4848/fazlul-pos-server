"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const categoryController_1 = require("../controllers/categoryController");
const router = express_1.default.Router();
router.route("/").post(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, categoryController_1.createCategory).get(categoryController_1.getAllCategory);
router.route("/:id").delete(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, categoryController_1.deleteCategory).put(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, categoryController_1.updateCategory).get(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, categoryController_1.getCategory);
exports.default = router;
