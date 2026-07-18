const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all URLs
router.get("/", (req, res) => {
  const sql = "SELECT * FROM urls ORDER BY is_favorite DESC, id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET statistics for dashboard
router.get("/stats", (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN is_favorite = 1 THEN 1 ELSE 0 END) AS favorites
    FROM urls
  `;

  const categorySql = `
    SELECT category, COUNT(*) AS count
    FROM urls
    GROUP BY category
    ORDER BY count DESC, category ASC
  `;

  db.query(sql, (summaryError, summaryResults) => {
    if (summaryError) {
      return res.status(500).json({ error: summaryError.message });
    }

    db.query(categorySql, (categoryError, categoryResults) => {
      if (categoryError) {
        return res.status(500).json({ error: categoryError.message });
      }

      res.json({
        ...(summaryResults[0] || { total: 0, favorites: 0 }),
        categories: categoryResults || [],
      });
    });
  });
});

// GET URLs by category (optional)
router.get("/category/:category", (req, res) => {
  const sql =
    "SELECT * FROM urls WHERE category = ? ORDER BY is_favorite DESC, id DESC";
  db.query(sql, [req.params.category], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ADD a new URL
router.post("/", (req, res) => {
  const { title, url, description, category, is_favorite } = req.body;

  const sql =
    "INSERT INTO urls (title, url, description, tags, notes, category, is_favorite) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [
      title,
      url,
      description || "",
      "",
      "",
      category || "General",
      is_favorite ? 1 : 0,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        id: result.insertId,
        title,
        url,
        description: description || "",
        category: category || "General",
        is_favorite: is_favorite ? 1 : 0,
      });
    }
  );
});

// UPDATE a URL
router.put("/:id", (req, res) => {
  const { title, url, description, category, is_favorite } = req.body;

  const sql =
    "UPDATE urls SET title=?, url=?, description=?, category=?, is_favorite=? WHERE id=?";

  db.query(
    sql,
    [
      title,
      url,
      description || "",
      category || "General",
      is_favorite ? 1 : 0,
      req.params.id,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "URL updated successfully" });
    }
  );
});

// UPDATE favorite status
router.patch("/:id/favorite", (req, res) => {
  const { is_favorite } = req.body;
  const sql = "UPDATE urls SET is_favorite=? WHERE id=?";

  db.query(sql, [is_favorite ? 1 : 0, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Favorite updated successfully" });
  });
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
