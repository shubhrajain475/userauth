import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Socket, Server } from "socket.io";

import userRoute from "./routes/userRoute.js";

export const app = express();

config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", userRoute);
