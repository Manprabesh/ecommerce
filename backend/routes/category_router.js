import express from 'express'
import { getAllCategory, createCategory, updateCategory } from '../controllers/category_controller.js';
const categoryRouter = express.Router()
categoryRouter.post('/create/category',createCategory);
categoryRouter.get('/get/category',getAllCategory);
categoryRouter.post('/update-category',updateCategory)
export default categoryRouter;