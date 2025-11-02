import pool from "../config/database.js";

export async function userTable(){
    const query = `
    CREATE TABLE IF NOT EXISTS users(
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) NOT NULL,
    password VARCHAR(20) NOT NULL
    )
    `
    await pool.query(query);
    console.log("✅ user table created");
}