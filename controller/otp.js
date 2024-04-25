import nodemailer from "nodemailer";
import { otp } from "../model/otp.js";
import { User } from "../model/user.js";

export const generateotp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email invalid" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ message: "Please enter valid email address" });
  }
  const generatedOTP = generateNumbericOTP(6);

  try {
    const newOTP = new otp({
      email,
      otp: generatedOTP,
    });
    await newOTP.save();
    res.json({ message: "OTP generated and saved to the database" });
    if (email) {
      sendOTPEmail(email, generatedOTP);
    } else {
    }
  } catch (err) {
    console.error("Error saving OTP to the database:", err);
    res
      .status(500)
      .json({ message: "Error saveing OTP to the database", error: err });
  }
};
function generateNumbericOTP(length) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }
  return otp;
}
function sendOTPEmail(email, otp) {
  const transporter =
    nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shubhrajain380@gmail.com",
       // pass: "ujzh vomm qemq hqkd",
        pass:"drzo qfyo jujs jtzh"
      },
    });
    const mailOptions={
        from:'shubhrajain380@gmail.com',
        to:email,
        subject:'OTP for verification',
        text:`Your OTP for verification is: ${otp}`,
    };
    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.error('Error sending OTP email',error);
        }
        else{
            console.log('Email send:',info.response);
        }
    })
}

export const verifyotp=async(req,res)=>{
    const {otp:userOTP}=req.body;
    console.log("request otp:",userOTP);
    try{
        const o=await otp.findOne({otp:userOTP});
        console.log("database otp",o);
        if(!o){
            return res.status(401).json({message:'otp is incorrect'});
        }
        const verifyotp= o.otp===userOTP;
        console.log(o.otp);
        console.log("verification result",verifyotp);
        if(verifyotp){
            res.json({message:'verify otp successfull'});
        }

    }
    catch(error){
        console.log('error querying mongodb:',error);
        res.status(500).json({message:'internal server error'});
    }
}