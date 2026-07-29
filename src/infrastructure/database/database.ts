import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
  db = await SQLite.openDatabaseAsync('documents.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      is_custom INTEGER DEFAULT 0,
      user_id TEXT
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      category_id TEXT,
      status TEXT NOT NULL DEFAULT 'en_attente',
      amount REAL,
      currency TEXT DEFAULT 'TND',
      tva REAL,
      provider TEXT,
      document_date TEXT,
      notes TEXT,
      image_path TEXT,
      image_remote_url TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS tags (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL UNIQUE,
      user_id TEXT
    );

    CREATE TABLE IF NOT EXISTS document_tags (
      document_id TEXT NOT NULL,
      tag_id TEXT NOT NULL,
      PRIMARY KEY (document_id, tag_id),
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_documents_date ON documents(document_date);
    CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category_id);
    CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
    CREATE INDEX IF NOT EXISTS idx_documents_synced ON documents(synced);
  `);

  await seedDefaultCategories();
};

const seedDefaultCategories = async () => {
  const defaults = [
    { id: 'cat_transport', name: 'Transport', icon: 'car' },
    { id: 'cat_alimentation', name: 'Alimentation', icon: 'utensils' },
    { id: 'cat_materiel', name: 'Matériel', icon: 'tool' },
    { id: 'cat_services', name: 'Services', icon: 'briefcase' },
    { id: 'cat_autre', name: 'Autre', icon: 'more-horizontal' },
  ];
  for (const cat of defaults) {
    await db.runAsync(
      `INSERT OR IGNORE INTO categories (id, name, icon, is_custom) VALUES (?, ?, ?, 0)`,
      [cat.id, cat.name, cat.icon]
    );
  }
};

export const getDb = () => db;