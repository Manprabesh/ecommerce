import pool from "../config/database.js";

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
    if (!category_name ) {
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
    console.log("result rows ->",result.rows)

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

export async function getAllCategory(req,res){
    try {
        const searchQuery = `SELECT * from categories`

        const result = await pool.query(searchQuery);

        console.log("getting  all category -->", result.rows);

        return res.status(200).json({
            success:true,
            category: result.rows
        })
    
    } catch (error) {
         console.error("❌ Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating category",
      error: error.message,
    });

    }}
