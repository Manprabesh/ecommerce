import pool from "../config/database.js";
import { aws_config } from "../config/aws.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand
} from "@aws-sdk/client-s3";
// import ApiResponse from "../utils/ApIResponse.js";
import api from "../utils/ApIResponse.js";
// import pool from "../config/database.js";
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
        const { name, description, price, category, product, quantity } = req.body;
        console.log("quanitity", quantity)
        console.log("req body", req.body)

        if (!name || !description || !price || !category || !product) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const searchQuery = {
            text: `SELECT *
            FROM categories
            where category_name = $1`,
            values: [category]
        }

        const response = await pool.query(searchQuery);
        console.log("response from category", response.rows[0].category_id)

        const imgUrl = await Promise.all(
            product.map(async (data) => {
                const put_object = new PutObjectCommand({
                    Bucket: "manprabesh-ecommerce",
                    Key: `products/${data.name}`,
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
            INSERT INTO products (name, description, price, category_id, quantity, product)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
            `;

        const result = await pool.query(insertQuery, [
            name,
            description,
            price,
            response.rows[0].category_id,
            quantity,
            fileNames,
        ]);

        result.rows[0].url = imgUrl
        console.log("result --->", result.rows[0]);

        res.status(201).json(
            api.response("✅ Product uploaded successfully", result.rows[0])
        );

    } catch (error) {
        console.error("❌ Error uploading product:", error);
        res.status(500).json(
            api.reject("Server error while uploading product", error)
        );
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

export async function getProductByFilter(req, res) {
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

        const result = await pool.query(query, params);
        console.log(result.rows)

        if (result.rows.length === 0) {
            return res.status(404).json(
                api.response("No product found", [], null, false)
            );
        }

        return res.status(200).json(
            api.response("fetch product successfully", result.rows, null, true)
        );
    } catch (error) {
        console.error("❌ Error fetching product:", error);
        res.status(500).json(
            api.reject("Server error while fetching product", error)
        );
    }
}

export async function getAllProduct(req, res) {
    try {

        // const query = 'SELECT * FROM products ORDER BY id';
        // const query = `
        // SELECT p.*, c.category_name 
        // FROM products p 
        // JOIN categories c ON p.category_id = c.category_id
        // ORDER BY c.category_name;`  

        const query = `
        SELECT *
            FROM (
                SELECT
                  p.*, c.category_name,
                 ROW_NUMBER() OVER (
                     PARTITION BY p.category_id
                    ORDER BY p.id DESC
                ) AS rn
                FROM products p JOIN categories c on p.category_id = c.category_id
            )ranked
        WHERE rn <= 6;`

        const result = await pool.query(query);
        console.log("->", result.rows)

        // process.exit()

        const total_product = result.rows.length;
        console.log("result ->", result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found",
                data: [],
            });
        }

        const productData = await Promise.all(result.rows.map(async (data) => {
            console.log("--------------------", result.rows)
            let url = [];
            if (data.product) {

                url = await Promise.all(data.product?.map(async (filename) => {

                    const get_command = new GetObjectCommand({
                        Bucket: "manprabesh-ecommerce",
                        Key: `products/${filename}`,
                    });

                    const presignedUrl = await getSignedUrl(aws_config(), get_command);
                    console.log('presigned --->', presignedUrl)
                    return presignedUrl;
                }))
                console.log("url ---->", url)
            }
            //getting product image url

            return {
                product_id: data.id,
                name: data.name,
                price: data.price,
                description: data.description,
                url: url,
                quantity: data.quantity,
                category: data.category_name,
                category_id: data.category_id
            };
        }));

        const data = {
            productData,
            total_product
        }

        console.log("Data to be send", data)

        return res.status(200).json(
            api.response("fetch product succesfully", data)
        )
    }
    catch (error) {
        console.error("Error while fetch all product", error);
        res.status(500).json(
            api.reject("server error while fetching product", error)
        )
    }
}

/**
 * Deleting the whole product
 */
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body;


        /* ---------- 1. Validation ---------- */
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }


        /* ---------- 3. Check Product ---------- */
        const product = await pool.query(
            `SELECT id FROM products WHERE id = $1`,
            [productId]
        );

        if (product.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        /* ---------- 4. Delete Product ---------- */
        await pool.query(
            `DELETE FROM products WHERE id = $1`,
            [productId]
        );

        /* ---------- 5. Success Response ---------- */
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete product error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/**
 * Fetching n number of product by using SQL pagination
 */
export const getNproduct = async (req, res) => {
    try {
        const { category, total, cursor } = req.params;
        console.log("Row to be fetched", total)
        console.log("Row to be Skipped", cursor)

        const query = `
        SELECT *
        FROM products p
        INNER JOIN categories c USING (category_id)
        WHERE c.category_name = $1
        AND p.id < $2
        ORDER BY p.id DESC
        LIMIT  $3
        `
        const value = [category, cursor, total];

        const response = await pool.query(query, value);
        console.log("response -->", response.rows)

        const productData = await Promise.all(response.rows.map(async (data) => {

            //getting product image url
            const url = await Promise.all(data.product.map(async (filename) => {

                const get_command = new GetObjectCommand({
                    Bucket: "manprabesh-ecommerce",
                    Key: `products/${filename}`,
                });

                const presignedUrl = await getSignedUrl(aws_config(), get_command);
                // console.log('presigned --->', presignedUrl)
                return presignedUrl;
            }))

            return {
                product_id: data.id,
                name: data.name,
                price: data.price,
                description: data.description,
                url: url,
                quantity: data.quantity,
                category: data.category_name,
                category_id: data.category_id
            };
        }));
        console.log("------------------------")
        console.log(productData.length)

        return res.status(200).json({ data: productData })
    } catch (error) {
        console.log("errro while getting N products", error)
    }
}

/**
 * Controller for deleting product images
 */
export const deleteProductImage = async (req, res) => {
    try {
        const { fileDetails } = req.body;

        const fileKey = fileDetails.fileName.replace(/^.*\//, "");
        console.log("key", fileKey);
      
        const filename = {
            Bucket: "manprabesh-ecommerce",
            Key: fileDetails.fileName.trim().substring(1, fileDetails.fileName.length)
        }
       
        const command = new DeleteObjectCommand(filename)
        const response = await aws_config().send(command)
        console.log("bucket deleted", response);

        const query = ' UPDATE products  SET product = array_remove(product, $1) WHERE id = $2 RETURNING *; '

        const { rows } = await pool.query(query, [fileKey, fileDetails.productID]);
        console.log("all rows", rows);

        return res.status(200).json(api.response("deleted file successfully"))
    } catch (error) {
        console.error("Error while deleting s3 object", error);
        return res.status(500).json(api.reject("server error while deleting product image", error))

    }
}

/**
 * Controller for updating products
 */
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, product, quantity } = req.body.productData;
        const { product_id, category_id } = req.body
        const { files } = req.body;

        console.log("reading body", req.body.product_id)


        let query = null;

        /**
        * updating product category id
        */
        if (category) {

            console.log("category", category);
            console.log("category ID", category_id);
            query = {
                text: `SELECT category_id from categories where category_name = $1`,
                values: [category]

            }
            let { rows } = await pool.query(query)
            console.log("fetching category", rows[0]['category_id']);

            query = {
                text: `UPDATE
               products set category_id =$1
               where id = $2`,
                values: [rows[0]['category_id'], product_id]
            }
            rows = await pool.query(query)
            console.log("updated category", rows)
        }

        /**
         * updating product description
         */
        if (description) {
            query = {
                text: ' UPDATE products SET description = $1 where id = $2',
                values: [description, product_id]
            }
            const { rows } = await pool.query(query);
            console.log("updated description", rows);
        }

        /**
         * updating product price
         */
        if (price) {
            query = {
                text: ' UPDATE products SET price = $1 where id = $2',
                values: [price, product_id]
            }
            const { rows } = await pool.query(query);
            console.log("updated price", rows);
        }

        /**
         * updating product name
         */
        if (name) {
            query = {
                text: ' UPDATE products SET name = $1 where id = $2',
                values: [name, product_id]
            }
            const { rows } = await pool.query(query);
            console.log("updated name", rows);
        }


        /**
         * updating product quantity
         */
        if (quantity) {
            query = {
                text: ' UPDATE products SET quantity = $1 where id = $2',
                values: [quantity, product_id]
            }
            const { rows } = await pool.query(query);
            console.log("updated quantity", rows);
        }



        /**
         * adding product images
         */
        let imgURL = null;
        if (files) {
            for (let i = 0; i < files.length; i++) {

                query = {
                    text: 'UPDATE products SET product = array_append(product, $1) WHERE id = $2',
                    values: [files[i].name, product_id]
                }


                let result = await pool.query(query);
                console.log("updateddd products images", result.rows[0]);


            }
            imgURL = await Promise.all(
                files.map(async (data) => {
                    const put_object = new PutObjectCommand({
                        Bucket: "manprabesh-ecommerce",
                        Key: `products/${data.name}`,
                    });

                    const presignedUrl = await getSignedUrl(aws_config(), put_object);
                    console.log('presigned', presignedUrl)
                    return presignedUrl;
                })
            );
            console.log("presgined images", imgURL);

        }
        return res.status(201).json(
            api.response("✅ Product uploaded successfully", { url: imgURL })
        );


    } catch (error) {
        console.log("error in update controller", error)
        return res.status(500).json(api.reject("server error while updating products", error))
    }
}