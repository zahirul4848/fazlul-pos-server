"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const salesController_1 = require("../controllers/salesController");
const router = express_1.default.Router();
router.route("/").post(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, salesController_1.createSale).get(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, salesController_1.getAllSales);
router.route("/adjustment/:id").put(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, salesController_1.dueAdjustment);
router.route("/:id").delete(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, salesController_1.deleteSale).get(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, salesController_1.getSale);
exports.default = router;
