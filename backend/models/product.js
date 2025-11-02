import pool from "../config/database.js";

export async function ProductTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      price FLOAT NOT NULL,
      category_id UUID REFERENCES categories(category_id) ON DELETE CASCADE,
      product TEXT[] NOT NULL 
    );
  `;
  await pool.query(query);
  console.log("✅ Product table is ready");
}
