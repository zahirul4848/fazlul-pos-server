"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
router.route("/").post(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, productController_1.createProduct).get(productController_1.getAllProducts);
router.route("/:id").delete(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, productController_1.deleteProduct).put(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, productController_1.updateProduct).get(productController_1.getProduct);
exports.default = router;
