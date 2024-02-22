import express, { Router } from "express";
import { confirmController } from "./controller";

const router: Router = express.Router();

export const machineRoutes = () => {
  router.post("/confirm", confirmController);
  return router;
};
