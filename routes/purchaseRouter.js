"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const purchaseController_1 = require("../controllers/purchaseController");
const router = express_1.default.Router();
router.route("/").post(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, purchaseController_1.createPurchase).get(purchaseController_1.getAllPurchase);
router.route("/:id").delete(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, purchaseController_1.deletePurchase).put(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, purchaseController_1.updatePurchase);
exports.default = router;
