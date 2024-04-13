import express from "express";
import { isAdmin, isAuth } from "../middleware/authMiddleware";
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  forgotPassword, 
  resetPassword, 
  getAllUsers, 
  deleteUser
 } from "../controllers/userController";

const router = express.Router();

router.route("/").post(registerUser).get(isAuth, isAdmin, getAllUsers);
router.route("/login").post(loginUser);
router.route("/forgotPassword").put(forgotPassword);
router.route("/resetPassword").put(resetPassword);
router.route("/profile").get(isAuth, getUserProfile).put(isAuth, updateUserProfile);
router.route("/:id").delete(isAuth, isAdmin, deleteUser);


export default router;