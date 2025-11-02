import pool from "../config/database.js";

export async function createUser(req,res) {
    try {
        const {email, password} = req.body;
        const searchQuery=`SELECT * from users where email = $1`;
         const response = await pool.query(searchQuery,[email]);

         console.log('response in user created ->', response);

         return res.status(409).json({
            success: false,
            message:"user already exist"
         })

        const insertQuery={
            text:`INSERT INTO users(email, password) VALUES ($1, $2) RETURNING *;`,
            values:[email, password]
        }
    } catch (error) {
          console.error("❌ Error uploading product:", error);
        res.status(500).json({ error: "Server error while creting user account" });
    }
}