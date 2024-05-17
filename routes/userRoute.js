import express from "express";

import {
  signup,
  login,
  updateUsers,
  deleteUsers,
  getAll,
  forgetPassword,
  updatePassword,
  resetPassword,
  logout,
} from "../controller/userController.js";
import { generateotp, verifyotp } from "../controller/otp.js";
import { isAuthenticatedUser } from "../middleware/auth.js";
import {contact} from "../controller/contactus.js"
import { scheduleEmail }from '../controller/emailController.js'

const router = express.Router();

router.post("/sign-up", signup);
router.post("/login", login);
router.patch("/update/:id", updateUsers);
router.delete("/delete/:id", deleteUsers);
//router.get("/getall",getAll);
router.route("/getall").get(isAuthenticatedUser, getAll);
//router.route("/password/forgot").post(forgetPassword);
router.post("/password/forget", forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.get("/logout", logout);
router.post("/otp", generateotp);
router.post("/verifyotp", verifyotp);
router.post("/contactus",contact)
router.post('/schedule-email',scheduleEmail);

export default router;
