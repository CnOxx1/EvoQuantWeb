const express = require('express');
const auth = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');
const { contactValidation } = require('../middleware/validate');
const db = require('../services/dbService');

const router = express.Router();

// Public: submit contact form
router.post('/', contactLimiter, contactValidation, (req, res) => {
  const { name, email, company, message, lang } = req.body;
  db.run(
    'INSERT INTO contact_submissions (name, email, company, message, lang) VALUES (?, ?, ?, ?, ?)',
    [name, email, company || '', message, lang || 'zh']
  );
  res.status(201).json({ success: true, message: 'Message received' });
});

// Admin: list submissions
router.get('/admin/all', auth, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const submissions = db.all(
    'SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
  const total = db.get('SELECT COUNT(*) as count FROM contact_submissions');
  res.json({ submissions, total: total.count, page, limit });
});

// Admin: mark as read
router.put('/admin/:id/read', auth, (req, res) => {
  db.run('UPDATE contact_submissions SET is_read = 1 WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
