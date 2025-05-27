import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"
import { uploadMedia, deleteMediaFromCloudinary } from "../utils/cloudinary.js"

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }
    return generateToken(res, user, `Welcome back ${user.name}`);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to login after the registration",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "logged out successfully",
      success: true
    })

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });

  }
}
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id
    const user = await User.findById(userId).select("-password").populate("enrolledCourses")
    if (!user) {
      res.status(404).json({
        message: "profile not fount",
        success: false
      })
    }
    return res.status(200).json({
      user,
      success: true
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }

}


export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updateData = { name };

    if (profilePhoto) {
      // Delete old photo if exists
      if (user.photoUrl) {
        const publicId = user.photoUrl.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }

      const cloudResponse = await uploadMedia(profilePhoto.path);
      updateData.photoUrl = cloudResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.log("Update Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
// In userController.js
export const addCertificate = async (req, res) => {
  const { userId } = req.params;
  const { courseName, completionDate } = req.body;

  try {
    const user = await User.findById(userId);
    user.certificates.push({ courseName, completionDate });
    await user.save();
    res.status(200).json({ success: true, message: "Certificate added" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving certificate" });
  }
};
export const getCertificates = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("certificates");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.certificates);
  } catch (err) {
    console.error("Error fetching certificates:", err);
    res.status(500).json({ message: "Server error" });
  }
};