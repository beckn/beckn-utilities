import { Express } from "express";
import { initApp, connectMongo } from ".";
import dotenv from "dotenv";
dotenv.config();

export const startServer = async (app: Express) => {
  const createdApp = initApp(app);
  const mongo_url: string = process.env.MONGO_URI as string;
  await connectMongo(mongo_url);
  createdApp.listen(process.env.PORT, () => {
    console.log(`Server Started on ${process.env.PORT}`);
  });
};
