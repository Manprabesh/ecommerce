import express from "express";
import { createUser } from "../controllers/user_auth_controller.js";
export const userRouter = express.Router();
userRouter.post("/create/user");