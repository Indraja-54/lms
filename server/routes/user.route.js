import express from "express"
import {register} from "../controller/user.controller.js"
import {login,getUserProfile,logout,updateProfile} from "../controller/user.controller.js"
import isAuthenticated from '../middlewares/isAuthenticated.js'
import upload from '../utils/multer.js'
import {addCertificate,getCertificates} from "../controller/user.controller.js"
const router=express.Router();

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/profile").get(isAuthenticated,getUserProfile);
router.route("/profile/update").patch(isAuthenticated,upload.single("profilePhoto"),updateProfile);
router.post("/:userId/certificates", addCertificate);
router.get("/:userId/certificates", getCertificates);

export default router;