import pool from '../utils/db.js'; // archivo que creaste con pg + dotenv

export const getItems = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM items");
    res.json(data.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getItem = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM items WHERE id = $1", [req.params.id]);
    res.json(data.rows[0]); // o .rows si quieres array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postItem = async (req, res) => {
  try {
    const { name, price } = req.body;

    const data = await pool.query(
      "INSERT INTO items (name, price) VALUES ($1, $2) RETURNING *",
      [name, price]
    );

    res.status(200).json({ operation: true, item: data.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const putItem = async (req, res) => {
  try {
    const { name, price } = req.body;
    const id = req.params.id;
    await pool.query("UPDATE items SET name = $1, price = $2 WHERE id = $3", [name, price, id]);
    res.status(200).json({ message: "Item updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
