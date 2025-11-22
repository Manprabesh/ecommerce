import jwt from "jsonwebtoken";

export default function generateToken(email, id = null) {
    const token = jwt.sign(
        { id: id, email: email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return token;
}