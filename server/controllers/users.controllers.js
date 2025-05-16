import {sqlConnect, sql} from "../db/sql.js";
import {hashPassword,getSalt} from "../utils/hash.js";

export const getUsers = async (req, res) => {
    try {
        const snapshot = await db.collection("users").get();
        const users = [];
        snapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

export const postUser = async (req, res) => { 
  try {
    const { name, username, password } = req.body;
    const salt = getSalt();
    const hash = hashPassword(salt, password); 
    const hashed = salt + hash;
    await db.collection("users").doc(username).set({ name, username, password: hashed });
    res.status(200).json({ operation: true, user: { name, username } });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

