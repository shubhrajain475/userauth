import express from "express";

import { signup, login,updateUsers,deleteUsers,getAll,forgetPassword,updatePassword ,resetPassword,logout} from "../controller/userController.js";
import { isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/sign-up", signup);
router.post("/login", login);
router.patch("/update/:id",updateUsers);
router.delete("/delete/:id",deleteUsers);
//router.get("/getall",getAll);
router.route("/getall").get(isAuthenticatedUser,getAll);
//router.route("/password/forgot").post(forgetPassword);
router.post("/password/forget",forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(isAuthenticatedUser,updatePassword);
router.get("/logout",logout);

export default router;
