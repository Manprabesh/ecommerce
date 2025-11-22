import express from 'express'
// import user_signup from '../controllers/user_auth_controller.js'
import { uploadProduct, getAllProduct, getProductByFilter } from '../controllers/product_controller.js';
const productRouter = express.Router()
productRouter.post('/upload/product',uploadProduct);
productRouter.get('/get/products',getAllProduct);
productRouter.get('/get/product',getProductByFilter);
export default productRouter;