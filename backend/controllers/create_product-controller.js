import pool from "../config/database.js";
import { aws_config } from "../config/aws.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
    GetObjectCommand,
    PutObjectCommand
} from "@aws-sdk/client-s3";
/**
 * 
 * @param {*} req - Express request object containing query parameters:
 *  - name => product name
 *  - description
 *  - price
 *  - category
 *  - product => product file name with its file type 
 * @param {*} res 
 * @returns 
 */
export async function uploadProduct(req, res) {
    try {
        const { name, description, price, category, product } = req.body;

        if (!name || !description || !price || !category || !product) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const searchQuery = {
            text: `SELECT * FROM categories where category_name = $1`,
            values: [category]
        }

        const response = await pool.query(searchQuery);
        console.log("response from category", response.rows[0].category_id)

        const imgUrl = await Promise.all(
            product.map(async (data) => {
                const put_object = new PutObjectCommand({
                    Bucket: "manprabesh-ecommerce",
                    Key: `products/${data.name}`,
                    // ContentType: "image/png",
                });

                const presignedUrl = await getSignedUrl(aws_config(), put_object);
                console.log('presigned', presignedUrl)
                return presignedUrl;
            })
        );

        console.log("arraof data", imgUrl)
        // process.exit()

        const fileNames = product.map(p => p.name);
        const insertQuery = `
            INSERT INTO products (name, description, price, category_id, product)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
            `;

        const result = await pool.query(insertQuery, [
            name,
            description,
            price,
            response.rows[0].category_id,
            fileNames,
        ]);

        console.log("result --->", result.rows);

        res.status(201).json({
            message: "✅ Product uploaded successfully",
            product: result.rows[0],
            imgUrl
        });

    } catch (error) {
        console.error("❌ Error uploading product:", error);
        res.status(500).json({ error: "Server error while uploading product" });
    }
}

/**
 * 
 * @param {*} req  - Express request object containing query parameters:
 *   - name {string} (optional): Filter by product name.
 *   - category {string} (optional): Filter by category.
 *   - minPrice {number} (optional): Minimum price filter.
 *   - maxPrice {number} (optional): Maximum price filter.
 * @param {*} res - Express response object for sending the response with status code 200 for OK or 404 for product not found or 500 for internal server error.
 * @returns -  Sends a JSON response containing a list of products or an error message.
 */

export async function getProduct(req, res) {
    try {
        const { name = null, category = null, minPrice = null, maxPrice = null } = req.query;
        console.log("name ->", name)
        console.log("category ->", category)
        console.log("minPrice ->", minPrice)
        console.log("maxPrice ->", maxPrice)

        let query = "SELECT * FROM products where 1=1";

        const params = [];

        // Dynamically build query
        if (name) {
            params.push(name);
            query += ` AND name ILIKE $${params.length} `;
        }

        if (category) {
            params.push(category);
            query += ` AND category = $${params.length} `
        }

        if (minPrice) {
            params.push(minPrice);
            query += ` AND price >= $${params.length}`
        }

        if (maxPrice) {
            params.push(maxPrice);
            query += ` AND price <= $${params.length}`
        }
        // query += " ORDER BY id DESC ;";
        const result = await pool.query(query, params);

        console.log(result.rows)

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found",
                data: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "fetch product successfully",
            data: result.rows
        });
    } catch (error) {
        console.error("❌ Error fetching product:", error);
        res.status(500).json({ error: "Server error while fetching product" });
    }
}

export async function getAllProduct(req, res) {
    try {
        const query = 'SELECT * FROM products ORDER BY id';

        const result = await pool.query(query);

        console.log("result ->", result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found",
                data: [],
            });
        }

        console.log("00000000000000000000 --->", result.rows)
        if (result.rows[0].product) {
        }

        

        const fileUrl =await Promise.all(result.rows.map(async (data) => {
           const url= await Promise.all(data.product.map(async (filename) => {

                const get_command = new GetObjectCommand({
                    Bucket: "manprabesh-ecommerce",
                    Key: `products/${filename}`,
                });

                const presignedUrl = await getSignedUrl(aws_config(), get_command);
                console.log('presigned --->', presignedUrl)
                console.log("____________________---")
                return presignedUrl;
            }))
            return url
        }));

        console.log("file URL ==============>",fileUrl);
        return res.status(200).json({
            success: true,
            message: "product fetch successfully",
            data: result.rows,
            images:fileUrl
        })
    }
    catch (error) {
        console.error("Error while fetch all product", error);
        res.status(500).json({
            error: "server errror while fetchin product"
        })
    }
}

