import bcrypt from "bcrypt";

export async function encryptPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

export async function decryptPassword(incomingPassword, databasePassword) {
    return await bcrypt.compare(incomingPassword, databasePassword);
}

