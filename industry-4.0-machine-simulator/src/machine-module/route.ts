import express, { Router } from "express";

const router: Router = express.Router();

export const machineRoutes = () => {
  router.post("/confirm", async (req, res) => {
    return res.json(req?.body);
  });
  return router;
};
