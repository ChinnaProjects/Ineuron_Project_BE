import mongoose from "mongoose";
import app from "./app.js";

import config from "./config/index.js";

(async () => {
  try {
    await mongoose.connect(config.MONGODB_URL);
    console.log("Database is Connected");
    app.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });
    const onListening = () => {
      console.log(`Port Number is ${config.PORT}`);
    };
    app.listen(config.PORT, onListening);
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
})();
