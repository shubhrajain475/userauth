import mongoose from "mongoose";

import { app } from "./app.js";

export const server = () => {
  mongoose.connect(process.env.MONGO_URI, {
    dbName: "Testdb",
  });
  console.log("Database connected to ", process.env.MONGO_URI);
  app.listen(process.env.PORT || 3000);
  console.log("Server running at port", process.env.PORT);
};
server();
