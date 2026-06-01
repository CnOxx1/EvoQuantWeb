const express = require('express');
const auth = require('../middleware/auth');
const { sectionValidation } = require('../middleware/validate');
const db = require('../services/dbService');

const router = express.Router();

// Admin: list sections for a page
router.get('/:pageId', auth, (req, res) => {
  const sections = db.all(
    'SELECT * FROM page_sections WHERE page_id = ? ORDER BY sort_order',
    [req.params.pageId]
  );
  res.json(sections);
});

// Admin: create section
router.post('/', auth, sectionValidation, (req, res) => {
  const { page_id, section_key, content_zh, content_en, image_url, sort_order } = req.body;
  try {
    const result = db.run(
      `INSERT INTO page_sections (page_id, section_key, content_zh, content_en, image_url, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [page_id, section_key, content_zh || '', content_en || '', image_url || '', sort_order || 0]
    );
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Section key already exists for this page' });
    }
    throw err;
  }
});

// Admin: update section
router.put('/:id', auth, sectionValidation, (req, res) => {
  const { content_zh, content_en, image_url, sort_order } = req.body;
  const existing = db.get('SELECT id FROM page_sections WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Section not found' });

  db.run(
    `UPDATE page_sections SET content_zh = ?, content_en = ?, image_url = ?, sort_order = ?, updated_at = datetime('now') WHERE id = ?`,
    [content_zh || '', content_en || '', image_url || '', sort_order || 0, req.params.id]
  );
  res.json({ success: true });
});

// Admin: delete section
router.delete('/:id', auth, (req, res) => {
  db.run('DELETE FROM page_sections WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
