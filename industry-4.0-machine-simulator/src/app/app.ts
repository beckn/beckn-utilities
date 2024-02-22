import express, { Express, Router, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { routes } from "./route";
export const initApp = (app: Express): Express => {
  const router: Router = express.Router();

  dotenv.config();
  app.options(
    "*",
    cors<Request>({
      origin: "*",
      optionsSuccessStatus: 200,
      credentials: true,
      methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"]
    })
  );

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"]
    })
  );

  app.set("trust proxy", true);
  app.use(express.urlencoded({ extended: true, limit: "200mb" }));
  app.use(express.json({ limit: "200mb" }));
  app.use(router);
  app.get("/ping", (req: Request, res: Response) => {
    return res.status(200).json({
      status: 200,
      message: "Pinged"
    });
  });

  router.use("/", routes());
  return app;
};
