import pool from "../config/database.js";

export async function categoryTable(){
    const query = `CREATE TABLE IF NOT EXISTS categories(
     category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     category_name VARCHAR(100) NOT NULL
    )`

await pool.query(query);
console.log("✅ category table is ready");
}