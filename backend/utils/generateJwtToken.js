import jwt from "jsonwebtoken";

export function generateToken(email, id = null) {
    const token = jwt.sign(
        { id: id, email: email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return token;
}

export function verifyToken(token) {
    console.log("yooo")
    if(!process.env.JWT_SECRET){
        throw new Error("yo something is wronf")
    }
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verified token", decoded) // bar
    return decoded;

}

// export default { generateToken, verifyToken }