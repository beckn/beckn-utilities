import express, { Express, Router, Request, Response } from "express";
import dotenv from "dotenv";
import http, { Server as HttpServer } from "http";
import cors from "cors";
import cache from "memory-cache";
import { Server } from "socket.io";
import { telmetryEventListner } from "./events";
export const initApp = (app: Express): HttpServer => {
  const router: Router = Router();
  const createServer = http.createServer(app);
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

  app.post("/telemetry", async (req: Request, res: Response) => {
    if (req?.body?.data?.events?.length) {
      console.log(
        "***************************-------***************************\n",
        JSON.stringify(req?.body),
        "\n***************************-------***************************"
      );
      if (req?.body?.data?.events[0].data.action === "search") {
        cache.put(
          "transaction_id",
          req?.body?.data?.events[0].data.transactionid
        );
      }
      if (
        req?.body?.data?.events[0].data.transactionid ===
        cache.get("transaction_id")
      ) {
        cache.put("telemetry", [...(cache.get("telemetry") || []), req?.body]);
        telmetryEventListner.emit("telemetry_update", cache.get("telemetry"));
      }
    }

    return res.status(200).json({
      status: 200,
      message: "Telemetry Data Received"
    });
  });
  const io = new Server(createServer, {
    cors: {
      origin: "*",
      methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"]
    }
  });
  io.of("/socket").on("connection", (socket) => {
    try {
      console.log("New Socket Create with Socker Id==>", socket.id);
      telmetryEventListner.on("telemetry_update", (telemetryData) => {
        console.log(
          "Telemetry Update Received===>",
          JSON.stringify(telemetryData)
        );
        socket.emit("telemetry_data", {
          data: telemetryData,
          message: "Telemetry Data Updated"
        });
      });
    } catch (error) {
      console.log("Socket Error====>", error);
    }
  });

  return createServer;
};