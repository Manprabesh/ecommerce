import pool from "../config/database.js";

export async function orderTable() {
    const query = ` 
    CREATE TABLE IF NOT EXISTS orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    total_amount NUMERIC(10, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'Pending', -- e.g., Pending, Shipped, Delivered, Cancelled

    payment_method VARCHAR(50), -- e.g., 'Card', 'UPI', 'COD'
    payment_status VARCHAR(50) DEFAULT 'Unpaid', -- e.g., Paid, Unpaid, Refunded

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
`

    await pool.query(query);
    console.log("created order table")
}