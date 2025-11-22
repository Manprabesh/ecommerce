import express from 'express'
import { create_order, verifyPayment, getAllOrders } from "../controllers/order_controller.js";
export const orderRouter = express.Router();

orderRouter.post("/create-order", create_order);
orderRouter.post("/verify-payment", verifyPayment);
orderRouter.get("/get/orders/:userId", getAllOrders);