const config = require('../config/env');

function adminPathGuard(req, res, next) {
  // Only apply to non-API, non-static routes in production
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  // In dev mode, Vite handles routing so skip
  if (config.nodeEnv === 'development') {
    return next();
  }
  // In production, if it's the admin path, allow; otherwise this is handled by SPA fallback
  next();
}

module.exports = adminPathGuard;
