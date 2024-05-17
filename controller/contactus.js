import {contactus} from "../model/contactus.js"
import nodemailer from "nodemailer";

export const contact =async(req,res)=>{
    const{name,email,message}=req.body;

const transporter=nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:'as9926261097@gmail.com',
        pass:'ujzh vomm qemq hqkd',
    }
});
const mailOptions={
    from:email,
    to:'shubhrajain380@gmail.com',
    subject:'New Contact Form submission',
    text:`Name: ${name}\nEmail: ${email}\nMessage: ${message}`

}
const newContact=new contactus({name,email,message});
await newContact.save();

   res.json({messsage:"yeeeeeh!!!!! saved to database"})
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
}
