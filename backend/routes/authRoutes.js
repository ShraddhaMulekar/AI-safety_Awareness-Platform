import express from 'express';
import { registerController } from '../controllers/authController/registerController.js';
import { loginController } from '../controllers/authController/loginController.js';

export const authRouter = express.Router();

authRouter.post("/register", registerController)
authRouter.post("/login", loginController)