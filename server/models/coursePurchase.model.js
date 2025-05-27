// models/CoursePurchase.js
import mongoose from "mongoose";

const CoursePurchaseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed']
  },
  paymentId: {
    type: String,
    required: true,
    unique:true
  }
}, { timestamps: true });

export const CoursePurchase = mongoose.model('CoursePurchase', CoursePurchaseSchema);