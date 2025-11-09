import pool from "../config/database.js";

export async function orderItemTable() {
    const query = ` 
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    order_id UUID REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,

    quantity INT DEFAULT 0,
    price NUMERIC(10, 2) NOT NULL, -- price per unit at time of purchase

    created_at TIMESTAMP DEFAULT NOW()
);
    `
    await pool.query(query);
console.log("created orderItem table")
}
