import db from "../db/firebase.js";
import {hashPassword} from "../utils/hash.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const user = await db.collection("users").doc(req.params.username).get();
if (!user.exists) {
    res.json({isLogin: false, user: {}});
    return;
}
const salt = user.data().password.substring(0,process.env.SALT_SIZE);
const hash = hashPassword(salt, req.body.password,salt);
const saltedHash = salt + hash;
let isLogin=user.data().password === saltedHash;
    if (isLogin) {
        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login success', user: user.data(), isLogin: true, token });
    } else {
        return res.status(400).json({ message: 'Login failed', user: {}, isLogin: false });
    }
};

export const createUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Generate salt
        const salt = crypto.randomBytes(24).toString('base64url').substring(0, 10);

        // Concatenate salt and password
        const newMsg = salt + password;
        // Create hash
        const hashing = crypto.createHash("sha512");
        const hash = hashing.update(newMsg).digest("base64url");

        // Connect to the database and insert user
        const pool = await sqlConnect();
        await pool.request()
            .input("username", sql.VarChar, username)
            .input("password", sql.VarChar, `${salt}:${hash}`)
            .query('INSERT INTO [tc3004b].[dbo].[users] (username, password) VALUES (@username, @password)');

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};