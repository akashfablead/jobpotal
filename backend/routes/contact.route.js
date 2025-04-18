import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { submitContactForm } from "../controllers/contact.controller.js";

const router = express.Router();

router.route("/contactform").post(isAuthenticated, submitContactForm);


export default router;

