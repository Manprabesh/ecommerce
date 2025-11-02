import express from "express";
import cors from "cors";
import 'dotenv/config'

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Connect to database and create table
 */
import pool from "./config/database.js";
const client = await pool.connect()
import { ProductTable } from "./models/product.js";
import { categoryTable } from "./models/category.js";
import { userTable } from "./models/user.js";

/**
 * Import router
 */
import productRouter from "./routes/create_product_router.js";
app.use("/api/v1",productRouter)
import categoryRouter from "./routes/category_router.js";
app.use("/api/v1",categoryRouter);



const PORT = 5000;
app.listen(PORT, () => {
    ProductTable();
    categoryTable();
    userTable()
    console.log(`Example app listening on port ${PORT}!`);
});

