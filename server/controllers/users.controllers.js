// controllers/users.controller.js
import pool from "../utils/db.js";
import { getSalt, hashPassword } from "../utils/hash.js";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, username, created_at FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Crear un usuario
export const postUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // Validación básica
    if (!name || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Hashear la contraseña
    const salt = getSalt();
    const hash = hashPassword(salt, password);
    const hashedPassword = `${salt}:${hash}`;

    // Insertar en PostgreSQL
    await pool.query(
      "INSERT INTO users (name, username, password, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)",
      [name, username, hashedPassword]
    );

    res.status(201).json({ operation: true, user: { name, username } });
  } catch (error) {
    if (error.code === '23505') {
      // Código de error de PostgreSQL para clave duplicada
      return res.status(409).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};
