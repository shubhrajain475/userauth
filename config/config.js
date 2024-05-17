import nodemailer from "nodemailer";
import Holidays from 'date-holidays';;
import dotenv from 'dotenv';

dotenv.config();

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    }
});

const holidays=new Holidays(process.env.HOLIDAY_COUNTRY,process.env.HOLIDAY_STATE);

export{transporter,holidays};