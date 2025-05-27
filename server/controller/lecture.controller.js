import mongoose from 'mongoose';
import { Lecture } from '../models/lecture.model.js';
import { Course } from '../models/course.model.js';
import { deleteMediaFromCloudinary, uploadMedia } from '../utils/cloudinary.js';

// CREATE LECTURE
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({ message: "Lecture title and course ID are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid Course ID format" });
    }

    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({ lecture, message: "Lecture created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create Lecture" });
  }
};

// GET ALL LECTURES FOR A COURSE
export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid Course ID format" });
    }

    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ lectures: course.lectures });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to get Lectures" });
  }
};

// EDIT LECTURE
export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;
    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    if (typeof isPreviewFree !== "undefined") lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).json({ lecture, message: "Lecture updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to edit Lecture" });
  }
};

// REMOVE LECTURE
export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    if (lecture.publicId) {
      await deleteMediaFromCloudinary(lecture.publicId);
    }

    await Course.updateOne({ lectures: lectureId }, { $pull: { lectures: lectureId } });

    return res.status(200).json({ message: "Lecture removed successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to remove lecture" });
  }
};

// GET LECTURE BY ID
export const getLectureById = async (req, res) => {
  const { lectureId } = req.params;

  if (!lectureId || lectureId === 'undefined') {
    return res.status(400).json({ message: 'Invalid or missing lectureId' });
  }

  try {
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: 'Lecture not found' });
    }
    res.status(200).json(lecture);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
