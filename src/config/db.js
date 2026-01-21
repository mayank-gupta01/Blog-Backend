const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false
    });

    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

module.exports = connectDB;
