import express, { Router } from "express";
import { confirmController, getController } from "./controller";

const router: Router = express.Router();

export const machineRoutes = () => {
  router.post("/confirm", confirmController);
  router.post("/status", getController);

  return router;
};
