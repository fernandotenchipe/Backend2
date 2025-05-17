// controllers/users.controller.js
import db from "../db/firebase.js";
import { getSalt, hashPassword } from "../utils/hash.js";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Crear un usuario
export const postUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    const salt = getSalt();
    const hash = hashPassword(salt, password);
    const hashed = salt + hash;

    await db.collection("users").doc(username).set({
      name,
      username,
      password: hashed,
      created_at: new Date()
    });

    res.status(201).json({ operation: true, user: { name, username } });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};
