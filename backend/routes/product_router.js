import express from 'express'
// import user_signup from '../controllers/user_auth_controller.js'
import {
    uploadProduct,
    getAllProduct,
    getProductByFilter,
    deleteProduct,
    getNproduct,
    deleteProductImage,
    updateProduct,
    getProducts,
    searchProduct
} from '../controllers/product_controller.js';
const productRouter = express.Router()
productRouter.post('/upload/product', uploadProduct);
productRouter.get('/get/products', getAllProduct);
productRouter.get('/get/product', getProductByFilter);
productRouter.post('/delete-product', deleteProduct);
productRouter.post('/delete-image', deleteProductImage);
productRouter.post('/update-product', updateProduct);
productRouter.get('/get-product',getProducts);
productRouter.get('/get/products/:category/:total/:cursor', getNproduct);
productRouter.get('/product',searchProduct)
export default productRouter;