import { Express } from "express";
import { initApp } from ".";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;
export const startServer = (app: Express) => {
  const createServer = initApp(app);
  createServer.listen(PORT, () => {
    console.log(`Server Started on PORT:${PORT}`);
  });
};
