import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createPurchase,
  confirmPurchase,
  failPurchase,
  getAllPurchasedCourse,
  getCourseDetailWithPurchaseStatus,getPendingPurchase
} from "../controller/coursePurchase.controller.js";

const router = express.Router();

// 1. Create a purchase (status = pending)
router.post("/create", isAuthenticated, createPurchase);

// 2. Confirm a purchase (status = completed)
router.put("/confirm/:paymentId", isAuthenticated, confirmPurchase);

// 3. Mark a purchase as failed (status = failed)
router.put("/fail/:paymentId", isAuthenticated, failPurchase);

// 4. Get course detail + purchase status for specific course
router.get("/course/:courseId/detail-with-status", isAuthenticated, getCourseDetailWithPurchaseStatus);

// 5. Get all completed purchases
router.get("/", isAuthenticated, getAllPurchasedCourse);
router.get("/pending/:courseId", isAuthenticated, getPendingPurchase);


export default router;
