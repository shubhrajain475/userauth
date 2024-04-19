import jwt from "jsonwebtoken";
import crypto from "crypto";

export const sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: (process.env.COOKIE_EXPIRE || 1) * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};


export const  getResetPasswordToken=()=>{
  const resetToken=crypto.randomBytes(20).toString("hex");
  return resetToken;
}

export const generateResetPasswordToken=(user)=>{
  const resetToken=getResetPasswordToken();
  user.resetPasswordToken=crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");
user.resetPasswordExpire=Date.now()+15*60*1000;
return resetToken;
};