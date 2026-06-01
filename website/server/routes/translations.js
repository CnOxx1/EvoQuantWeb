const express = require('express');
const auth = require('../middleware/auth');
const db = require('../services/dbService');

const router = express.Router();

// Public: get all translations for a language
router.get('/:lang', (req, res) => {
  const { lang } = req.params;
  if (!['zh', 'en', 'ja'].includes(lang)) {
    return res.status(400).json({ error: 'Invalid language. Use zh or en.' });
  }
  const rows = db.all('SELECT key, value FROM translations WHERE lang = ?', [lang]);
  const result = {};
  rows.forEach(r => { result[r.key] = r.value; });
  res.json(result);
});

// Admin: get all translations for a language (includes all keys)
router.get('/admin/:lang', auth, (req, res) => {
  const { lang } = req.params;
  if (!['zh', 'en', 'ja'].includes(lang)) {
    return res.status(400).json({ error: 'Invalid language. Use zh or en.' });
  }
  const rows = db.all('SELECT * FROM translations WHERE lang = ? ORDER BY key', [lang]);
  res.json(rows);
});

// Admin: bulk update translations for a language
router.put('/:lang', auth, (req, res) => {
  const { lang } = req.params;
  if (!['zh', 'en', 'ja'].includes(lang)) {
    return res.status(400).json({ error: 'Invalid language. Use zh or en.' });
  }
  const data = req.body;
  if (typeof data !== 'object') {
    return res.status(400).json({ error: 'Body must be an object of key-value pairs' });
  }

  const stmt = db.run; // alias
  for (const [key, value] of Object.entries(data)) {
    db.run(
      `INSERT INTO translations (lang, key, value) VALUES (?, ?, ?)
       ON CONFLICT(lang, key) DO UPDATE SET value = ?, updated_at = datetime('now')`,
      [lang, key, String(value), String(value)]
    );
  }
  res.json({ success: true });
});

module.exports = router;
