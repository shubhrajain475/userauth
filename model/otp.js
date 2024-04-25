import mongoose from "mongoose";


const userSchema1 = new mongoose.Schema({
 
  email: {
    type: String

  },
 
otp:{
  type:String
    }
   
})


export const otp=mongoose.model("otp",userSchema1);
//export default mongoose.model("User",userSchema);