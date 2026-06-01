const express = require('express');
const auth = require('../middleware/auth');
const { partnerValidation } = require('../middleware/validate');
const db = require('../services/dbService');

const router = express.Router();

// Public: get active partners
router.get('/', (req, res) => {
  const partners = db.all('SELECT * FROM partners WHERE is_active = 1 ORDER BY sort_order');
  res.json(partners);
});

// Admin: get all partners
router.get('/admin/all', auth, (req, res) => {
  const partners = db.all('SELECT * FROM partners ORDER BY sort_order');
  res.json(partners);
});

// Admin: create partner
router.post('/', auth, partnerValidation, (req, res) => {
  const { name_zh, name_en, logo_url, url, description_zh, description_en, sort_order, is_active } = req.body;
  const result = db.run(
    `INSERT INTO partners (name_zh, name_en, logo_url, url, description_zh, description_en, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name_zh, name_en, logo_url || '', url || '', description_zh || '', description_en || '', sort_order || 0, is_active ?? 1]
  );
  res.status(201).json({ id: result.lastInsertRowid });
});

// Admin: update partner
router.put('/:id', auth, partnerValidation, (req, res) => {
  const { name_zh, name_en, logo_url, url, description_zh, description_en, sort_order, is_active } = req.body;
  db.run(
    `UPDATE partners SET name_zh=?, name_en=?, logo_url=?, url=?, description_zh=?, description_en=?, sort_order=?, is_active=? WHERE id=?`,
    [name_zh, name_en, logo_url || '', url || '', description_zh || '', description_en || '', sort_order || 0, is_active ?? 1, req.params.id]
  );
  res.json({ success: true });
});

// Admin: delete partner
router.delete('/:id', auth, (req, res) => {
  db.run('DELETE FROM partners WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
