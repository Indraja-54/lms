import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { v4 as uuidv4 } from 'uuid';  // Import UUID for unique paymentId generation

// 1. Create a new Purchase Record (status = pending)
export const createPurchase = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;

    // 1. Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    // 2. Check if the course price is defined
    if (typeof course.coursePrice !== "number") {
      return res.status(400).json({ message: "Course price is missing or invalid" });
    }

    // 3. Check if purchase already exists
    const existingPurchase = await CoursePurchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(409).json({ message: "Course already purchased" });
    }

    // 4. Create the purchase with all required fields
    const paymentId = uuidv4();

    const newPurchase = await CoursePurchase.create({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId,
    });

    return res.status(201).json(newPurchase);
  } catch (error) {
    console.error("Create Purchase Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 2. Confirm a Purchase (status = completed)
export const confirmPurchase = async (req, res) => {
  try {
    const { paymentId } = req.params;  // Receive paymentId from request params

    const purchase = await CoursePurchase.findOne({ paymentId }).populate("courseId");
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found!" });
    }

    purchase.status = "completed";

    // Make all lectures visible by setting `isPreviewFree` to true
    if (purchase.courseId && purchase.courseId.lectures.length > 0) {
      await Lecture.updateMany(
        { _id: { $in: purchase.courseId.lectures } },
        { $set: { isPreviewFree: true } }
      );
    }

    await purchase.save();

    // Update user's enrolledCourses
    await User.findByIdAndUpdate(
      purchase.userId,
      { $addToSet: { enrolledCourses: purchase.courseId._id } },
      { new: true }
    );

    // Update course's enrolledStudents
    await Course.findByIdAndUpdate(
      purchase.courseId._id,
      { $addToSet: { enrolledStudents: purchase.userId } },
      { new: true }
    );

    return res.status(200).json({ message: "Purchase confirmed", purchase });
  } catch (error) {
    console.error("Confirm Purchase Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 3. Mark Purchase as Failed
export const failPurchase = async (req, res) => {
  try {
    const { paymentId } = req.params;  // Receive paymentId from request params

    const purchase = await CoursePurchase.findOne({ paymentId });
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found!" });
    }

    purchase.status = "failed";
    await purchase.save();

    return res.status(200).json({ message: "Purchase failed", purchase });
  } catch (error) {
    console.error("Fail Purchase Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 4. Get Purchase Status for Specific Course & User
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId)
      .populate("creator")
      .populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const purchased = await CoursePurchase.findOne({ userId, courseId });

    return res.status(200).json({
      course,
      purchased: !!purchased && purchased.status === "completed",
    });
  } catch (error) {
    console.error("Get Course Detail Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// 5. Get All Completed Purchases
export const getAllPurchasedCourse = async (req, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    return res.status(200).json({
      purchasedCourse: purchasedCourse || [],
    });
  } catch (error) {
    console.error("Get All Purchases Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Get pending purchase for a course and user
export const getPendingPurchase = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    const pendingPurchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "pending",
    });

    if (!pendingPurchase) {
      return res.status(404).json({ message: "No pending purchase found" });
    }

    return res.status(200).json({   });
  } catch (error) {
    console.error("Get Pending Purchase Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
