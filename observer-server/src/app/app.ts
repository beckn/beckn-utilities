import express, { Express, Router, Request, Response, response } from "express";
import dotenv from "dotenv";
import http, { Server as HttpServer } from "http";
import cors from "cors";
import cache from "memory-cache";
import { Server } from "socket.io";
import { telmetryEventListner } from "./events";
import { UEI_DOMAIN, UEI_STAKEHOLDERS } from "../utils/constants";
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
    if (
      req?.body?.data?.events?.length &&
      req?.body?.data?.events[0].context?.domain === UEI_DOMAIN
    ) {
      console.log(
        "***************************-------***************************\n",
        JSON.stringify(req?.body),
        "\n***************************-------***************************"
      );
      if (
        (req?.body?.data?.events[0].data.action === "search" &&
          req?.body?.data?.events[0].context?.source?.uri) ||
        (req?.body?.data?.events[0].context?.source?.id ===
          UEI_STAKEHOLDERS.sheruBAP &&
          req?.body?.data?.events[0].data.action === "init")
      ) {
        cache.put("telemetry", []);
        cache.put(
          "transaction_id",
          req?.body?.data?.events[0].data.transactionid
        );
      }
      if (
        req?.body?.data?.events[0].data.transactionid ===
        cache.get("transaction_id")
      ) {
        const telemtryData: any[] = cache.get("telemetry");
        let isDuplicateData = false;
        const sourceId = req?.body?.data?.events[0].context?.source?.id;
        const targetId = req?.body?.data?.events[0].context?.target?.id;

        if (
          (Object.values(UEI_STAKEHOLDERS).includes(sourceId) &&
            (!targetId ||
              Object.values(UEI_STAKEHOLDERS).includes(targetId))) ||
          (!sourceId && Object.values(UEI_STAKEHOLDERS).includes(targetId))
        ) {
          console.log(
            "***************************-------***************************\n",
            req?.body?.data?.events[0].context?.source?.id || "Gateway",
            " to ",
            req?.body?.data?.events[0].context?.target?.id,
            " for ",
            req?.body?.data?.events[0].data?.action,
            " and transaction_id ",
            req?.body?.data?.events[0].data?.transactionid,
            "\n***************************-------***************************"
          );
          if (req?.body?.data?.events[0].data?.action !== "search") {
            isDuplicateData = telemtryData?.find(
              (data: any) =>
                data?.data?.events[0]?.context?.source?.id ===
                  req?.body?.data?.events[0].context?.source?.id &&
                data?.data?.events[0]?.context?.source?.uri ===
                  req?.body?.data?.events[0].context?.source?.uri &&
                data?.data?.events[0]?.context?.target?.id ===
                  req?.body?.data?.events[0].context?.target?.id &&
                data?.data?.events[0]?.context?.target?.uri ===
                  req?.body?.data?.events[0].context?.target?.uri &&
                data?.data?.events[0]?.data?.action ===
                  req?.body?.data?.events[0].data?.action &&
                data?.data?.events[0]?.data?.transactionid ===
                  req?.body?.data?.events[0].data?.transactionid
            );
          }
          isDuplicateData
            ? null
            : cache.put("telemetry", [
                ...(cache.get("telemetry") || []),
                req?.body
              ]);
          telmetryEventListner.emit("telemetry_update", cache.get("telemetry"));
        }
      }
    }

    return res.status(200).json({
      status: 200,
      message: "Telemetry Data Received"
    });
  });
  app.post("/clear-cache", (req: Request, res: Response) => {
    try {
      cache.clear();
      return res.status(200).json({
        message: "Cache Cleared",
        success: true
      });
    } catch (error: any) {
      return res.status(500).json({
        message: `Cache not Cleared due to ${error.message}`,
        success: false
      });
    }
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
        // console.log(
        //   "Telemetry Update Received===>",
        //   JSON.stringify(telemetryData)
        // );
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
