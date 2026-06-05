// import dns from "dns";
// dns.setServers(["1.1.1.1", "8.8.8.8"]);

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);

    console.log("MongoDB Connected");

    return conn;
  } catch (error) {
    console.error("MongoDB Error:", error);
    throw error;
  }
}
