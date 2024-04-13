"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.route("/").post(userController_1.registerUser).get(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, userController_1.getAllUsers);
router.route("/login").post(userController_1.loginUser);
router.route("/forgotPassword").put(userController_1.forgotPassword);
router.route("/resetPassword").put(userController_1.resetPassword);
router.route("/profile").get(authMiddleware_1.isAuth, userController_1.getUserProfile).put(authMiddleware_1.isAuth, userController_1.updateUserProfile);
router.route("/:id").delete(authMiddleware_1.isAuth, authMiddleware_1.isAdmin, userController_1.deleteUser);
exports.default = router;
