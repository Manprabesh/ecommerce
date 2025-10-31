import express from 'express'
// import user_signup from '../controllers/user_auth_controller.js'
import { uploadProduct, getAllProduct, getProduct } from '../controllers/create_product-controller.js';
const productRouter = express.Router()
productRouter.post('/upload/product',uploadProduct);
productRouter.get('/get/products',getAllProduct);
productRouter.get('/get/product',getProduct);
export default productRouter;