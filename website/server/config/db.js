const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'database.sqlite');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      last_login_at TEXT
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title_zh TEXT NOT NULL DEFAULT '',
      title_en TEXT NOT NULL DEFAULT '',
      meta_description_zh TEXT DEFAULT '',
      meta_description_en TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS page_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
      section_key TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      content_zh TEXT DEFAULT '',
      content_en TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(page_id, section_key)
    );

    CREATE TABLE IF NOT EXISTS friendly_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_zh TEXT NOT NULL DEFAULT '',
      category_en TEXT NOT NULL DEFAULT '',
      title_zh TEXT NOT NULL DEFAULT '',
      title_en TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL,
      description_zh TEXT DEFAULT '',
      description_en TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS founders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_zh TEXT NOT NULL DEFAULT '',
      name_en TEXT NOT NULL DEFAULT '',
      title_zh TEXT NOT NULL DEFAULT '',
      title_en TEXT NOT NULL DEFAULT '',
      bio_zh TEXT DEFAULT '',
      bio_en TEXT DEFAULT '',
      photo_url TEXT DEFAULT '',
      email TEXT DEFAULT '',
      social_links TEXT DEFAULT '{}',
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_zh TEXT NOT NULL DEFAULT '',
      name_en TEXT NOT NULL DEFAULT '',
      logo_url TEXT DEFAULT '',
      url TEXT DEFAULT '',
      description_zh TEXT DEFAULT '',
      description_en TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lang TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(lang, key)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '',
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      company TEXT DEFAULT '',
      message TEXT NOT NULL DEFAULT '',
      lang TEXT DEFAULT 'zh',
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address TEXT NOT NULL,
      attempted_at TEXT DEFAULT (datetime('now')),
      success INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
    CREATE INDEX IF NOT EXISTS idx_sections_page ON page_sections(page_id, section_key);
    CREATE INDEX IF NOT EXISTS idx_translations_lang_key ON translations(lang, key);
    CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address, attempted_at);
  `);
}

module.exports = { getDb };
