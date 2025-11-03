import express from 'express'
export const cartRouter = express.Router()
import { addToCart, getCart } from '../controllers/cart_controller.js'
addToCart('/create/cart',addToCart);
addToCart('/get/cart',addToCart);