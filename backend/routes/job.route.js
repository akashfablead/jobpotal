import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteJob, editJob, getAdminJobs, getAllJobs, getJobById, getSimilarJobs, postJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
// new add
router.route("/editjobs/:id").post(isAuthenticated, editJob);
router.route("/delete/:id").post(isAuthenticated, deleteJob);
router.route("/similar/:id").get(isAuthenticated, getSimilarJobs);

export default router;

