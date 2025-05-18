import pool from "../utils/db.js";
import { hashPassword } from "../utils/hash.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User not found", isLogin: false });
    }

    const storedPassword = user.password; // Formato: salt:hash
    const [salt, storedHash] = storedPassword.split(":");

    const generatedHash = hashPassword(salt, password); 
    const isLogin = storedHash === generatedHash;

    if (!isLogin) {
      return res.status(401).json({ message: "Invalid credentials", isLogin: false });
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({});
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};
export const createUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.createHmac("sha256", salt).update(password).digest("hex");
    const saltedHash = `${salt}:${hash}`;

    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, saltedHash]
    );

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error creating user", error: error.message });
  }
};
