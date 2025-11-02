import express from 'express'
import { getAllCategory, createCategory } from '../controllers/category_controller.js';
const categoryRouter = express.Router()
categoryRouter.post('/create/category',createCategory);
categoryRouter.get('/get/category',getAllCategory)
export default categoryRouter;