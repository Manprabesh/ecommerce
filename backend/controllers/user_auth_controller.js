import pool from "../config/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import api from "../utils/ApIResponse.js";
import {generateToken} from "../utils/generateJwtToken.js";
import { encryptPassword, decryptPassword } from "../utils/encryptDecryptPassword.js";



export async function createUser(req, res) {
    try {

        const email = req.body.email;
        const password = req.body.password;

        /**
         * Getting the admin email and admin password
        */

        const admind_email = process.env.admin_email;
        const admind_password = process.env.admin_password;
        console.log("creating user", email)

        let hashedPassword = null;

        const searchQuery = `SELECT * from users where email = $1`;
        let response = await pool.query(searchQuery, [email]);
        console.log("response",response.rows[0]);
        let role = (email === admind_email ? "admin":"user");
        console.log("role --->",role)

        if (email === admind_email && response.rows.length > 0) {

            return res.status(409).json(
                api.response("Useralready exist", false)
            )
        }
        console.log("admin is creating")

        hashedPassword = await encryptPassword(password);
        console.log("hashpassword", hashedPassword);
        const insertQuery = {
            text: `INSERT INTO users(email, password, role) VALUES ($1, $2, $3) RETURNING user_id, email, role;`,
            values: [email, hashedPassword, role]
        }

        const result = await pool.query(insertQuery)
        const userToken = generateToken(result.rows[0]['email'], result.rows[0]['user_id'])

        res.cookie("ecommerceToken", userToken, {
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            maxAge: 48 * 60 * 60 * 1000,
            path: "/",
        });
        return res.status(200).json(
            api.response("New user created", {
                id: result.rows[0]['user_id'],
                email: result.rows[0]['email'],
                role: result.rows[0]['role']
            }))
    } catch (error) {
        console.error("❌ Error creating user:", error);
        res.status(500).json(api.reject("Server error while creting user account", error));
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const admin_email = process.env.admin_email;
        const admind_password = process.env.admin_password;
        const searchQuery = `SELECT * FROM users WHERE email = $1`;

        let cookieName = null;
        let cookieValue = null;
        let responseValue = null;

        //check for admin else for user
        if (email === admin_email && password === admind_password) {
            const result = await pool.query(searchQuery, [email])
            console.log("getting users data -------->", result.rows[0])
            cookieName = "ecommerceToken"
            cookieValue = generateToken(result.rows[0].email,result.rows[0].user_id);
            responseValue = {
                email: admin_email,
                role: "admin"
            };
        }

        else {

            //Check if user exists
            const response = await pool.query(searchQuery, [email]);

            if (response.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            //  Compare password with hash
            const isPasswordValid = await decryptPassword(password, response.rows[0].password);
            if (!isPasswordValid) {
                return res.status(401).json(api.reject("Invalid email or password"));
            }

            // Generate JWT token
            cookieValue = generateToken(response.rows[0].email, response.rows[0].user_id);
            cookieName = "ecommerceToken"
            responseValue = {
                id: response.rows[0].user_id,
                email: response.rows[0].email,
                role: "user"
            }
            console.log("✅ User logged in:", response.rows[0].email);
        }

        res.cookie(cookieName, cookieValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only HTTPS in production
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 48 * 60 * 60 * 1000,
            path: "/"
        });

        return res.status(200).json(api.response("login successfull", responseValue));

    } catch (error) {
        console.error("❌ Error during login:", error);
        return res.status(500).json(api.reject('server error during login', error));
    }
}