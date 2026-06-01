const { getDb } = require('../config/db');

function run(sql, params = []) {
  const db = getDb();
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}

function get(sql, params = []) {
  const db = getDb();
  const stmt = db.prepare(sql);
  return stmt.get(...params);
}

function all(sql, params = []) {
  const db = getDb();
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

module.exports = { run, get, all };
