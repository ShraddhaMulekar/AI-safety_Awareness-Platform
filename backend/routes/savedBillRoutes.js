import express from "express";
import { savedBillController } from "../controllers/savedBill/savedBillController.js";
import { getSavedBillsController } from "../controllers/savedBill/getSavedBillsController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

export const savedBillRouter = express.Router();

savedBillRouter.use(authenticateUser);

savedBillRouter.post("/save", savedBillController)
savedBillRouter.get("/", getSavedBillsController)