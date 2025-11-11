import express from 'express'
export const cartRouter = express.Router()
import { addToCart, getCart, deleteCart } from '../controllers/cart_controller.js'
cartRouter.post('/create/cart',addToCart);
cartRouter.get('/get/cart',getCart);
cartRouter.delete('/delete/cart',deleteCart);