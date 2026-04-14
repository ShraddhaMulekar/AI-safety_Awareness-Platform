import express from "express";
import { scamController } from "../controllers/scamController.js";

export const scamRoutes = express.Router()

scamRoutes.post("/analyze", scamController)