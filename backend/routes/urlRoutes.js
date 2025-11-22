const express = require("express");
const router = express.Router();
const db = require("../db"); // your MySQL connection

// GET all URLs
router.get("/", (req, res) => {
  const sql = "SELECT * FROM urls ORDER BY createdAt DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET URLs by category (optional)
router.get("/category/:category", (req, res) => {
  const sql = "SELECT * FROM urls WHERE category = ? ORDER BY createdAt DESC";
  db.query(sql, [req.params.category], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ADD a new URL
router.post("/", (req, res) => {
  const { title, url, description, tags, notes, category } = req.body;
  const sql =
    "INSERT INTO urls (title, url, description, tags, notes, category) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [title, url, description, tags, notes, category || "General"],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, title, url, description, tags, notes, category });
    }
  );
});

// UPDATE a URL
router.put("/:id", (req, res) => {
  const { title, url, description, tags, notes, category } = req.body;
  const sql =
    "UPDATE urls SET title=?, url=?, description=?, tags=?, notes=?, category=? WHERE id=?";
  db.query(
    sql,
    [title, url, description, tags, notes, category, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "URL updated successfully" });
    }
  );
});

// DELETE a URL
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM urls WHERE id=?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "URL deleted successfully" });
  });
});

module.exports = router;
