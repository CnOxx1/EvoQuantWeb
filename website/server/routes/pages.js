const express = require('express');
const auth = require('../middleware/auth');
const db = require('../services/dbService');

const router = express.Router();

router.get('/', (req, res) => {
  const pages = db.all('SELECT id, slug, title_zh, title_en, meta_description_zh, meta_description_en, updated_at FROM pages ORDER BY id');
  res.json(pages);
});

router.get('/:slug', (req, res) => {
  const page = db.get('SELECT * FROM pages WHERE slug = ?', [req.params.slug]);
  if (!page) return res.status(404).json({ error: 'Page not found' });
  const sections = db.all(
    'SELECT * FROM page_sections WHERE page_id = ? ORDER BY sort_order',
    [page.id]
  );
  res.json({ ...page, sections });
});

router.put('/:slug', auth, (req, res) => {
  const { title_zh, title_en, meta_description_zh, meta_description_en } = req.body;
  const existing = db.get('SELECT id FROM pages WHERE slug = ?', [req.params.slug]);
  if (!existing) return res.status(404).json({ error: 'Page not found' });

  db.run(
    `UPDATE pages SET title_zh = ?, title_en = ?, meta_description_zh = ?, meta_description_en = ?, updated_at = datetime('now') WHERE slug = ?`,
    [title_zh || '', title_en || '', meta_description_zh || '', meta_description_en || '', req.params.slug]
  );
  res.json({ success: true });
});

module.exports = router;
