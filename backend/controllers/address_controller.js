import pool from "../config/database.js";
import api from "../utils/ApIResponse.js";

export const createAddress = async (req, res) => {
  try {
    const {
      user_id,
      full_name,
      phone_number,
      address_line_1,
      city,
      state,
      postal_code,
      country,
      is_default
    } = req.body;

    // Required fields validation
    if (!user_id || !address_line_1 || !city || !state || !postal_code || !country) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // If user sets a default address, remove existing default
    if (is_default === true) {
      await pool.query(
        `UPDATE addresses SET is_default = false WHERE user_id = $1`,
        [user_id]
      );
    }

    const query = `
      INSERT INTO addresses (
        user_id,
        full_name,
        phone_number,
        address_line_1,
        city,
        state,
        postal_code,
        country,
        is_default
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;
    `;

    const values = [
      user_id,
      full_name,
      phone_number,
      address_line_1,
      city,
      state,
      postal_code,
      country,
      is_default || false,
    ];

    const { rows } = await pool.query(query, values);

    return res.status(201).json(api.response("Address added successfully",
     rows[0],
    ));

  } catch (error) {
    console.error("Add Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getAddressById = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate required params
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "Address ID is required",
      });
    }

    const query = `
      SELECT *
      FROM addresses
      WHERE user_id = $1;
    `;

    const { rows } = await pool.query(query, [user_id]);

    // Check if address exists
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    console.log("rows ---->", rows);

    // Success response
    return res.status(200).json(
      api.response("Address fetched successfully", rows)
    );

  } catch (error) {
    console.error("Fetch Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
