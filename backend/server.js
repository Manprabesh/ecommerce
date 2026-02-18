import express from "express";
import cors from "cors";
import 'dotenv/config'
import cookieParser from "cookie-parser"; 

const app = express();
// app.use(cors());
app.use(express.json());
app.use(cookieParser())

let whitelist = ['http://localhost:5173','http://192.168.162.191:5000','http://localhost','*'];
let corsOptions = { 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: function (origin, callback) {
        console.log('origin ----',origin);
        if (!origin || whitelist.indexOf(origin) !== -1) {
            console.log("----------",origin)
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}
app.use(cors(corsOptions))

/**
 * Connect to database and create table
 */
import pool from "./config/database.js";
const client = await pool.connect()
import { ProductTable } from "./models/product.js";
import { categoryTable } from "./models/category.js";
import { userTable } from "./models/user.js";
import { cartTable } from "./models/cart.js";
import { orderTable } from "./models/order.js";
import { orderItemTable } from "./models/orderItem.js";
import { addressTable } from "./models/address.js";

/**
 * Import router
 */
import productRouter from "./routes/product_router.js";
app.use("/api/v1",productRouter)
import categoryRouter from "./routes/category_router.js";
app.use("/api/v1",categoryRouter);
// import { userRouter } from "./routes/user_router.js";
// app.use('/api/v1',userRouter);
import { cartRouter } from "./routes/cart_router.js";
app.use('/api/v1',cartRouter);
import authRouter from "./routes/user_auth_router.js";
app.use('/api/v1',authRouter);
import { orderRouter } from "./routes/order_router.js";
app.use('/api/v1',orderRouter)
import { addressRouter } from "./routes/address_router.js";
app.use("/api/v1",addressRouter)

//import server side event
import sse_router from "./routes/sse_router.js";
app.use('/api/v1',sse_router)

const PORT = 5000;
app.listen(PORT, () => {
    ProductTable();
    categoryTable();
    userTable();
    cartTable();
    orderTable();
    orderItemTable();
    addressTable()
    console.log(`Example app listening on port ${PORT}!`);
});

