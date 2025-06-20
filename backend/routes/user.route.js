import express from "express";
import { checkSubscriptionStatus, deleteEducationEntry, deleteExperienceEntry, googleAuth, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/auth/google").post(googleAuth);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/education/:userId").post(isAuthenticated, deleteEducationEntry);
router.route("/experience/:userId").post(isAuthenticated, deleteExperienceEntry);
router.route("/check-subscription/:userId").get(isAuthenticated, checkSubscriptionStatus);

export default router;

