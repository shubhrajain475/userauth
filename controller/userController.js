import { User } from "../model/user.js";
import { sendCookie } from "../utils/feature.js";
import { isAuthenticatedUser } from "../middleware/auth.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateResetPasswordToken } from "../utils/feature.js";

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, "kko");
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).send({
        message: "User already exist",
        success: false,
      });
    }
    user = await User.create({
      name,
      email,
      password,
      //hashedPassword,
      confirmPassword,
    });
    //console.log("hy");
    // return res.status(200).send({
    //   user,
    //   message: "successful",
    //   success: true,
    // });
    sendCookie(user, res, "Registration successful", 200);
  } catch (error) {
    return res.status(500).send({
      message: `Internalserver error: ${error}`,
      success: false,
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).send({
        message: "User not found:${error}",
        success: "true",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Your email or password is wrong",
        success: false,
      });
    }
    user.password = "";
    sendCookie(user, res, `Welcome back',${user.name}`, 200);
  } catch (err) {
    console.log("Error", err);
    return res.status(501).json({
      success: "false",
      message: "Intefnal Server",
    });
  }
};

export const updateUsers = async (req, res) => {
  try {
    const updatedUsers = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        users: updatedUsers,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const deleteUsers = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    console.log(req.query);
    const get = await User.find(req.query);

    res.status(200).json({
      status: "success",
      length: get.length,
      data: {
        get,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
//Forget Password
export const forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "user not found",
      });
    }

    const resetToken = generateResetPasswordToken(user);
    console.log(resetToken);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000;
    await user.save({ validateBeforeSave: false });
    //   const result= resetToken.save();
    //  console.log(result);
    //user.resetPasswordExpire = Date.now() + 3600000;
    // console.log("heeeeee");
    // await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
    const message = `Your password reset token is:-\n\n ${resetPasswordUrl} \n\n If you have not requested this email then ,please ignore it,`;
    res.json({
      success: true,
      user,
      resetPasswordUrl,
      message: `Email sent to ${user.email}successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Error",
    });
  }
};

//reset password
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = req.params.token;

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "false",
        message: "Reset Password Token is invalid or has been expired",
      });
    }

    if (req.body.newPassword != req.body.confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Password does not match",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

    const updatedPassword = await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { password: hashedPassword } },
      // console.log(user.password),
      { new: true, upsert: true }
    );
    console.log("fffffffffffffffffffff"),
      // user.password = hashedPassword;

      // user.resetPasswordExpire = undefined;
      //user.resetPasswordToken = undefined;
      //  await user.save();
      res.status(200).json({
        status: "success",
        message: "Your Password has been reset Successfully",
      });
    //sendCookie(user, res, "Your Password Reset Succesful", 200);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "cannot reset password",
    });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select(
      "+password"
    );

    const isPasswordMatched = bcrypt.compare(
      req.body.oldPassword,
      user.password
    );

    if (!isPasswordMatched) {
      return res.status(404).json({
        status: "fail",
        message: "Please enter correct Password to update",
      });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(404).json({
        status: "fail",
        message: "confirm password does not match",
      });
    }
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    //console.log("hehehehehhehehe");
    user.password = hashedPassword;
    await user.save();
    sendCookie(user, res, `Password Updated Successfully`, 200);
  } catch (error) {
    console.log("Error updating password", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


export const logout=(req,res,next)=>{
  try{
    res.status(200).cookie("token","",{
      expires:new Date(Date.now()),
      sameSite:process.env.NODE_ENV ==="Development"?"lax":"none",
      secure:process.env.NODE_ENV ==="Development"?false:true,
    })
    .json({
      success:true,
      user:req.user,
    })
  }
    catch(error){
      console.log(error);
    }
    
  }














