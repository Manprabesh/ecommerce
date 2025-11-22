import express from 'express'
export const cartRouter = express.Router()
import { addToCart, getCart, deleteCart, reduceFromCart } from '../controllers/cart_controller.js'
cartRouter.post('/create/cart',addToCart);
cartRouter.get('/get/cart/:user_id',getCart);
cartRouter.post('/delete/cart',deleteCart);
cartRouter.post('/update/cart',reduceFromCart);
// cartRouter.