const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config/env');
const { getDb } = require('./config/db');

// Initialize database
getDb();

const app = express();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: config.nodeEnv === 'production' ? false : 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/links', require('./routes/links'));
app.use('/api/founders', require('./routes/founders'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/translations', require('./routes/translations'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/contact', require('./routes/contact'));

// In production, serve the built React app
if (config.nodeEnv === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  // SPA fallback — admin path and all client routes go to index.html
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      // API routes not matched above return 404
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error handler
app.use((err, req, res, _next) => {
  console.error('Server error:', err);
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
