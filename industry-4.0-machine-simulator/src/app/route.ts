import express, { Router } from "express";
import { machineRoutes } from "../machine-module/route";

const router: Router = express.Router();

export const routes = () => {
  router.use("/machine", machineRoutes());
  return router;
};
