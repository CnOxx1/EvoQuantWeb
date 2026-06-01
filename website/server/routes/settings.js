const express = require('express');
const auth = require('../middleware/auth');
const db = require('../services/dbService');

const router = express.Router();

// Public: get non-sensitive settings
router.get('/public', (req, res) => {
  const rows = db.all("SELECT key, value FROM settings WHERE key NOT LIKE '%secret%' AND key NOT LIKE '%password%'");
  const result = {};
  rows.forEach(r => { result[r.key] = r.value; });
  res.json(result);
});

// Admin: get all settings
router.get('/admin/all', auth, (req, res) => {
  const rows = db.all('SELECT * FROM settings');
  res.json(rows);
});

// Admin: bulk update settings
router.put('/admin/all', auth, (req, res) => {
  const data = req.body;
  if (typeof data !== 'object') {
    return res.status(400).json({ error: 'Body must be an object of key-value pairs' });
  }
  for (const [key, value] of Object.entries(data)) {
    db.run(
      `INSERT INTO settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = datetime('now')`,
      [key, String(value), String(value)]
    );
  }
  res.json({ success: true });
});

module.exports = router;
