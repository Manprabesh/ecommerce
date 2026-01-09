import { verifyToken } from "../utils/generateJwtToken.js"
import pool from "../config/database.js";

const isAuthenticated = async (req, res, next) => {
    try {

        const cookie = req.cookies.ecommerceToken;
        console.log("Cookie -------->",cookie);
        let data;
        try {
            data = verifyToken(cookie);
        } catch (error) {
            console.log("new error",error)
            return res.status(404).json({ message: "cookie is missing" });
        }

        const query = `Select email, user_id from users where user_id = $1 AND email = $2`;
        const user = await pool.query(query, [data.id, data.email]);
        console.log("user data", user.rows[0]);

        if (!user.rows[0]) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        else {
            req.user = {
                email : user.rows[0].email,
                user_ID : user.rows[0].user_id,
            }
        }
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal authentication error",
        });
    }
}

export default isAuthenticated