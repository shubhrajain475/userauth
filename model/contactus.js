import mongoose from "mongoose";

const userSchema2=new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    },
    message:{
        type:String,
    }

})
export const contactus=mongoose.model("contactus",userSchema2);
