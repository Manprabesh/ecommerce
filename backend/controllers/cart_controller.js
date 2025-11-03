import pool from "../config/database.js";

// controllers/cart.controller.js
import pool from "../config/database.js";

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
