import pool from "../config/database.js";
import api from "../utils/ApIResponse.js";
import { sendSSE } from "../utils/sse.js";
/**
 * Create a new product category
 * 
 * @param {*} req - Express request object containing:
 *   - category_name {string}: Name of the category to create.
 * @param {*} res - Express response object.
 * @returns {JSON} - Response containing success status and created category.
 */
export async function createCategory(req, res) {
  try {
    const { category_name } = req.body;

    // ✅ Validate input
    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    // ✅ Insert category into DB
    const insertQuery = {
      text: `INSERT INTO categories (category_name) VALUES ($1) RETURNING *;`,
      values: [category_name],
    };

    const result = await pool.query(insertQuery);
    console.log("result rows ->", result.rows)

    //server side event
    const query = "SELECT * from categories"
    const {rows } = await pool.query(query);
    sendSSE("category_created", rows);

    // ✅ Return success
    return res.status(201).json({
      success: true,
      message: "✅ Category created successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("❌ Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating category",
      error: error.message,
    });
  }
}

export async function getAllCategory(req, res) {
  try {
    const searchQuery = `SELECT * from categories`

    const result = await pool.query(searchQuery);

    console.log("getting  all category -->", result.rows);

    return res.status(200).json({
      success: true,
      category: result.rows
    })

  } catch (error) {
    console.error("❌ Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating category",
      error: error.message,
    });

  }
}

export async function deleteCategory(req, res) {
  try {
    const { category_id } = req.body;


    if (!category_id) {
      return res.status(400).json(api.reject("Missing category_id"));
    }

    const query = {
      text: "DELETE FROM categories WHERE category_id = $1",
      values: [category_id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      return res.status(404).json(api.reject("Category not found"));
    }

    return res.status(200).json(api.response("Category deleted successfully", true));
  } catch (err) {
    console.error("❌ Error deleting category:", err.message);
    return res.status(500).json(api.reject("Internal server error", err));
  }
}

export async function updateCategory(req, res) {
  try {
    const { category_id } = req.body;
    const { category_name } = req.body;

    if (!category_id || !category_name) {
      return res.status(400).json(api.reject("Missing category_id or category_name"));
    }

    const query = {
      text: `
        UPDATE categories
        SET category_name = $1
        WHERE category_id = $2
      `,
      values: [category_name, category_id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      return res.status(404).json(api.reject("Category not found"));
    }

    return res.status(200).json(api.response("Category updated successfully", true));
  } catch (err) {
    console.error("❌ Error updating category:", err.message);
    return res.status(500).json(api.reject("Internal server error", err));
  }
}

