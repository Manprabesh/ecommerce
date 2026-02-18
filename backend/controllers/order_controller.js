import api from "../utils/ApIResponse.js";
import pool from "../config/database.js";
import { config_razorpay } from "../config/razorpay.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import { aws_config } from "../config/aws.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function create_order(req, res) {
    try {
        const { amount, currency, receipt, notes, userID, products } = req.body;

        /**
         * total amount
         * productID,
         * product quantity,
         * each product price,
         * products =[{product_id,price, quantity}]
         */

        console.log("total amount", amount)

        // let prods = JSON.parse(products)
        console.log("products -->", products);
        // console.log("products -->", prods);

        //create order table
        const query = "INSERT INTO orders (user_id, total_amount) VALUES ($1, $2) RETURNING *";


        const result = await pool.query(query, [userID, amount])
        console.log("-------------- 77777777777777", result.rows[0].order_id)

        console.log("results -->", result.rows[0]);

        await Promise.all(
            products.map(async (data) => {
                console.log("psdofkdof", data)
                const orderItemQuery = "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *";

                const orderItemResult = await pool.query(orderItemQuery, [result.rows[0].order_id, data.product_id, data.product_quantity]);

                console.log("DATA --->", orderItemResult.rows[0]);

            })
        )
        const options = {
            amount: amount * 100,
            currency,
            receipt,
        }

        const userQuery = "SELECT email, role from users where user_id = $1"
        const userValue = userID;

        const userResult = await pool.query(userQuery, [userValue]);
        // console.log("user result", userResult.rows[0]);

        const razorpay = await config_razorpay();
        const order = await razorpay.orders.create(options);
        // console.log("orders", order)

        return res.status(201).json(api.response("product created successfully", { order, email: userResult.rows[0], order_id: result.rows[0].order_id }))

    } catch (error) {
        console.error(" Error in order controller", error)
        return res.status(500).json(api.reject("Internal server error", error))
    }
}


export async function verifyPayment(req, res) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;
    console.log("request", req.body)
    const secret = "qfYS1IjdGdp9kPM6ZP7XTkQL";

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    console.log("The body ----------->", body);
    try {
        const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);

        console.log("it is valid", isValidSignature)
        if (isValidSignature) {
            // const orders = 
            console.log("it is valid", isValidSignature)
            // console.log("order id", order_id)
            console.log("razorpay id", razorpay_order_id)
            console.log("order_i --------->d", order_id)


            //set status = paid
            const updateQuery = `UPDATE orders SET payment_status = $1 where order_id = $2 AND payment_status = 'Unpaid'`
            const value = ["Paid", order_id];

            const result = await pool.query(updateQuery, value);

            console.log("result --->", result)


            return res.status(201).json(api.response("User verified successfully "))


        }
    } catch (error) {
        // res.status()
        console.error("error in veifying", error)
    }
}

export async function getAllOrders(req, res) {
    try {
        const user_id = req.params.userId;

        const orderQuery = ` SELECT * FROM orders WHERE user_id =$1 AND payment_status = $2 ORDER BY created_at DESC`;

        const value = [user_id, 'Paid'];

        const result = await pool.query(orderQuery, value);
        const item = await Promise.all(
            result.rows.map(async (data, index) => {
                const orderItemQuery = `SELECT * from order_items where order_id = $1`;
                const response = await pool.query(orderItemQuery, [data.order_id]);
                return response.rows
            })
        )

        const ordered_products = await Promise.all(
            item[0].map(async (data, i) => {
                console.log("prder--->", data)
                const getOrderQuery = `
                SELECT * FROM order_items o_item
                JOIN orders o ON o_item.order_id = o.order_id
                JOIN products p ON o_item.product_id = p.id
                where o_item.order_item_id = $1
                `
                const xyz = await pool.query(getOrderQuery, [data.order_item_id])
                return xyz.rows[0]
            })
        )

        await Promise.all(ordered_products.map(async (data, i) => {
            const url = await Promise.all(data.product.map(async (filename) => {

                console.log("filename", filename)

                const get_command = new GetObjectCommand({
                    Bucket: "manprabesh-ecommerce",
                    Key: `products/${filename}`,
                });
                const signedUrl = await getSignedUrl(aws_config(), get_command);
                return signedUrl;
            }))
            ordered_products[i].product = url;
        }))

        // console.log("new orderedproducts", ordered_products)

        // console.log("results ", result.rows)
        return res.status(200).json(api.response("fetch all user products", ordered_products))
    } catch (error) {
        console.error("Error in get order controller", error);
        return res.status(500).json(api.reject("Internal server error", error));
    }
}


