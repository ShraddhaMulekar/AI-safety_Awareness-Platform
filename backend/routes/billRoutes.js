import express from "express";
import { billController } from "../controllers/billController.js";
import { uploadFile } from "../middleware/uploadMiddleware.js";

export const billRouter = express.Router()

billRouter.post("/upload", uploadFile, billController);