import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectMongo = async (mongo_url: string) => {
  try {
    await connect(mongo_url);
    console.log("MongoDB Connected...");
  } catch (err: any) {
    console.log("Error message", err?.message);
  }
};
