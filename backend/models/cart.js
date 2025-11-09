import pool from "../config/database.js";

export async function cartTable(params) {
  const query = ` 
    CREATE TABLE IF NOT EXISTS cart(
    cart_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE
    )
    `

  await pool.query(query);
  console.log("created cart table")
}