import mongoose from "mongoose";
import cron from 'node-cron';
import { sendScheduledEmails } from "./controller/emailController.js";
import dotenv from 'dotenv'

dotenv.config();

import { app } from "./app.js";

cron.schedule('5 20 * * 1-5',sendScheduledEmails);

export const server = () => {
  mongoose.connect(process.env.MONGO_URI, {
    dbName: "Testdb",
  });
  console.log("Database connected to ", process.env.MONGO_URI);
  app.listen(process.env.PORT || 3000);
  console.log("Server running at port", process.env.PORT);
};
server();
