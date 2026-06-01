const express = require('express');
const auth = require('../middleware/auth');
const { linkValidation } = require('../middleware/validate');
const db = require('../services/dbService');

const router = express.Router();

// Public: get active links
router.get('/', (req, res) => {
  const category = req.query.category;
  let links;
  if (category) {
    links = db.all(
      'SELECT * FROM friendly_links WHERE is_active = 1 AND category_zh = ? ORDER BY sort_order',
      [category]
    );
  } else {
    links = db.all('SELECT * FROM friendly_links WHERE is_active = 1 ORDER BY sort_order');
  }
  res.json(links);
});

// Admin: get all links
router.get('/admin/all', auth, (req, res) => {
  const links = db.all('SELECT * FROM friendly_links ORDER BY sort_order');
  res.json(links);
});

// Admin: create link
router.post('/', auth, linkValidation, (req, res) => {
  const { category_zh, category_en, title_zh, title_en, url, description_zh, description_en, sort_order, is_active } = req.body;
  const result = db.run(
    `INSERT INTO friendly_links (category_zh, category_en, title_zh, title_en, url, description_zh, description_en, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [category_zh, category_en, title_zh, title_en, url, description_zh || '', description_en || '', sort_order || 0, is_active ?? 1]
  );
  res.status(201).json({ id: result.lastInsertRowid });
});

// Admin: update link
router.put('/:id', auth, linkValidation, (req, res) => {
  const { category_zh, category_en, title_zh, title_en, url, description_zh, description_en, sort_order, is_active } = req.body;
  db.run(
    `UPDATE friendly_links SET category_zh=?, category_en=?, title_zh=?, title_en=?, url=?, description_zh=?, description_en=?, sort_order=?, is_active=? WHERE id=?`,
    [category_zh, category_en, title_zh, title_en, url, description_zh || '', description_en || '', sort_order || 0, is_active ?? 1, req.params.id]
  );
  res.json({ success: true });
});

// Admin: delete link
router.delete('/:id', auth, (req, res) => {
  db.run('DELETE FROM friendly_links WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
