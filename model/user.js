import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim:true
  },
  email: {
    type: String,
    required: [true, "please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
   lowercase:true
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 character"],
    select: false,
  },
  confirmPassword:{
   type:String,
   required:[true,"please confirm your password"],
   validate:{
    //only work for save and create
    validator:function(val){
return val==this.password;
    },
    message:"Password and confirm password does not match "
   },
   select:false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken:String,
  resetPasswordExpire:Date
});

userSchema.pre('save',async function(next){
if(!this.isModified('password'))return next;
this.password=await bcrypt.hash(this.password,12);
this.confirmPassword=undefined;
next();
})



export const User=mongoose.model("User",userSchema);
//export default mongoose.model("User",userSchema);