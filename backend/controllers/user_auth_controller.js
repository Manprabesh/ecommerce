import pool from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import api from "../utils/ApIResponse.js";

export async function createUser(req, res) {
    try {
        const email = req.body.category_name.email;
        const password = req.body.category_name.password;
        // console.log(req.body.category_name.email)
        console.log("email", email, 'password', password)
        const searchQuery = `SELECT * from users where email = $1`;
        const response = await pool.query(searchQuery, [email]);

        console.log('response in user created ->', response);
        if (response.rows.length > 0) {

            return res.status(409).json({
                success: false,
                message: "user already exist"
            })
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const insertQuery = {
            text: `INSERT INTO users(email, password) VALUES ($1, $2) RETURNING *;`,
            values: [email, hashedPassword]
        }
        const result = await pool.query(insertQuery)
        console.log("---------------------")
        console.log(result.rows)
        const token = jwt.sign(
            { id: result.rows[0].user_id, email: result.rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        console.log('token -------->', token)
        res.cookie("ecommerceToken", token, {
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            maxAge: 48 * 60 * 60 * 1000,
            path: "/",
        });
        return res.status(200).json(api.response("New user created", {
            id: result.rows[0].user_id,
            email: result.rows[0].email,
        }))
    } catch (error) {
        console.error("❌ Error uploading product:", error);
        res.status(500).json(api.reject("Server error while creting user account", error));
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        console.log("Login attempt ->", email);

        // 1️⃣ Check if user exists
        const searchQuery = `SELECT * FROM users WHERE email = $1`;
        const response = await pool.query(searchQuery, [email]);

        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        let user = response.rows[0];

        // 2️⃣ Compare password with hash
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 3️⃣ Generate JWT token
        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        user = {
            id: user.user_id,
            email: user.email,
        }

        // 4️⃣ Set cookie securely
        res.cookie("ecommerceToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only HTTPS in production
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });

        console.log("✅ User logged in:", user.email);
        return res.status(200).json(api.response("Login successful", user))


    } catch (error) {
        console.error("❌ Error during login:", error);
        return res.status(500).json(api.reject('server error during login', error));
    }
}