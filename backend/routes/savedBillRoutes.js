import express from "express";
import { savedBillController } from "../controllers/savedBill/savedBillController.js";
import { getSavedBillsController } from "../controllers/savedBill/getSavedBillsController.js";

export const savedBillRouter = express.Router();

savedBillRouter.post("/save", savedBillController)
savedBillRouter.get("/", getSavedBillsController)