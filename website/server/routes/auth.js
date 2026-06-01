const express = require('express');
const bcrypt = require('bcryptjs');
const { loginLimiter } = require('../middleware/rateLimiter');
const { loginValidation } = require('../middleware/validate');
const auth = require('../middleware/auth');
const { sign } = require('../services/jwtService');
const db = require('../services/dbService');

const router = express.Router();

router.post('/login', loginLimiter, loginValidation, (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;

  const user = db.get('SELECT * FROM admin_users WHERE username = ?', [username]);
  if (!user) {
    db.run('INSERT INTO login_attempts (ip_address, success) VALUES (?, 0)', [ip]);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    db.run('INSERT INTO login_attempts (ip_address, success) VALUES (?, 0)', [ip]);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  db.run('UPDATE admin_users SET last_login_at = datetime(\'now\') WHERE id = ?', [user.id]);
  db.run('INSERT INTO login_attempts (ip_address, success) VALUES (?, 1)', [ip]);

  const token = sign({ userId: user.id, username: user.username });
  res.json({ token });
});

router.get('/verify', auth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
