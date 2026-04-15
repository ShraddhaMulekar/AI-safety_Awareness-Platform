import express from "express";
import { uploadImage } from "../middleware/uploadMiddleware.js";
import { billController } from "../controllers/billController.js";

export const billRouter = express.Router()

billRouter.post("/test-upload", uploadImage, billController);