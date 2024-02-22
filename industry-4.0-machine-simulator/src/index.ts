import express, { Express } from "express";
import { startServer } from "./app";
const app: Express = express();

startServer(app);
