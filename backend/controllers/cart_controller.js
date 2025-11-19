import pool from "../config/database.js";
import { aws_config } from "../config/aws.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  GetObjectCommand,
  PutObjectCommand
} from "@aws-sdk/client-s3";
// import ApiResponse from "../utils/ApIResponse.js";
import api from "../utils/ApIResponse.js";
/**
 * Add a product to user's cart
 */
export async function addToCart(req, res) {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ success: false, message: "user_id and product_id are required" });
    }

    // Check if the product already exists in the user's cart
    const checkQuery = {
      text: `SELECT * FROM cart WHERE user_id = $1 AND product_id = $2`,
      values: [user_id, product_id],
    };
    const existing = await pool.query(checkQuery);

    if (existing.rows.length > 0) {
      // Product already exists → update quantity
      const updateQuery = {
        text: `UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *`,
        values: [quantity || 1, user_id, product_id],
      };
      const updated = await pool.query(updateQuery);
      return res.status(200).json({
        success: true,
        message: "✅ Cart updated successfully",
        cart: updated.rows[0],
      });
    }

    // Product not in cart → insert new row
    const insertQuery = {
      text: `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
      values: [user_id, product_id, quantity || 1],
    };
    const result = await pool.query(insertQuery);

    res.status(201).json({
      success: true,
      message: "🛒 Product added to cart",
      cart: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error adding to cart:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


export const getCart = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log("user id", user_id)
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const query = `
      SELECT
        c.cart_id,
        c.quantity,
        c.created_at,
        p.id AS product_id,
        p.name AS product_name,
        p.description,
        p.price,
        p.product,
        p.category_id
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;

    const { rows } = await pool.query(query, [user_id]);

    const data = await Promise.all(
      rows.map(async (cart) => {
        const url = await Promise.all(
          cart.product.map(async (p) => {
            const put_object = new GetObjectCommand({
              Bucket: "manprabesh-ecommerce",
              Key: `products/${p}`,
            });

            const presignedUrl = await getSignedUrl(aws_config(), put_object);
            console.log('presigned', presignedUrl)
            return presignedUrl;
          })
        )
        cart.product = url

      })
    )

    // console.log("data--->",data);
    return res.status(200).json(api.response("cart fetch successfully", rows));

  } catch (error) {
    console.error("Get Cart Error:", error);
    return res.status(500).json(api.reject("internal server error", error));
  }
};

export const reduceFromCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ success: false, message: "user_id and product_id are required" });
    }

    const updateQuery = {
      text: `UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *`,
      values: [quantity || -1, user_id, product_id],
    };

    const updated = await pool.query(updateQuery);

    console.log("updated data",updated);

    return res.status(200).json({
      success: true,
      message: "✅ Cart updated successfully",
      cart: updated.rows[0],
    });

  } catch (error) {

  }
}

export const deleteCart = async (req, res) => {
  try {
    const { cart_id } = req.body;
    console.log("cart id",req.body)

    if (!cart_id) {
      return res.status(400).json({
        success: false,
        message: "cart_id is required",
      });
    }

    const deleteQuery = `
      DELETE FROM cart
      WHERE cart_id = $1
      RETURNING *;
    `;

    const { rows } = await pool.query(deleteQuery, [cart_id]);

    if (rows.length === 0) {
      return res.status(404).json(api.response("Cart Item not dound"))
    }

    return res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
      data: rows[0],
    });

  } catch (error) {
    console.error("Delete Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};