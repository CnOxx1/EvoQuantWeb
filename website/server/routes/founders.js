const express = require('express');
const auth = require('../middleware/auth');
const { founderValidation } = require('../middleware/validate');
const db = require('../services/dbService');

const router = express.Router();

// Public: get active founders
router.get('/', (req, res) => {
  const founders = db.all('SELECT * FROM founders WHERE is_active = 1 ORDER BY sort_order');
  res.json(founders);
});

// Admin: get all founders
router.get('/admin/all', auth, (req, res) => {
  const founders = db.all('SELECT * FROM founders ORDER BY sort_order');
  res.json(founders);
});

// Admin: create founder
router.post('/', auth, founderValidation, (req, res) => {
  const { name_zh, name_en, title_zh, title_en, bio_zh, bio_en, photo_url, email, social_links, sort_order, is_active } = req.body;
  const result = db.run(
    `INSERT INTO founders (name_zh, name_en, title_zh, title_en, bio_zh, bio_en, photo_url, email, social_links, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name_zh, name_en, title_zh, title_en, bio_zh || '', bio_en || '', photo_url || '', email || '', social_links || '{}', sort_order || 0, is_active ?? 1]
  );
  res.status(201).json({ id: result.lastInsertRowid });
});

// Admin: update founder
router.put('/:id', auth, founderValidation, (req, res) => {
  const { name_zh, name_en, title_zh, title_en, bio_zh, bio_en, photo_url, email, social_links, sort_order, is_active } = req.body;
  db.run(
    `UPDATE founders SET name_zh=?, name_en=?, title_zh=?, title_en=?, bio_zh=?, bio_en=?, photo_url=?, email=?, social_links=?, sort_order=?, is_active=? WHERE id=?`,
    [name_zh, name_en, title_zh, title_en, bio_zh || '', bio_en || '', photo_url || '', email || '', social_links || '{}', sort_order || 0, is_active ?? 1, req.params.id]
  );
  res.json({ success: true });
});

// Admin: delete founder
router.delete('/:id', auth, (req, res) => {
  db.run('DELETE FROM founders WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
