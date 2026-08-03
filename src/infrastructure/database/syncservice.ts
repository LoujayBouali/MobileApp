import { supabase } from './supabaseClient';
import { getDb } from './database';

export const syncDocuments = async () => {
  const db = getDb();

  // 1. Pousser les documents locaux modifiés
  const unsynced = await db.getAllAsync(`SELECT * FROM documents WHERE synced = 0`);
  for (const doc of unsynced as any[]) {
    const { error } = await supabase.from('documents').upsert(doc);
    if (!error) {
      await db.runAsync(`UPDATE documents SET synced = 1 WHERE id = ?`, [doc.id]);
    }
  }

  // 2. Tirer les changements distants plus récents
  const { data: remoteDocs } = await supabase
    .from('documents')
    .select('*')
    .order('updated_at', { ascending: false });

  if (remoteDocs) {
    for (const doc of remoteDocs) {
      await db.runAsync(
        `INSERT OR REPLACE INTO documents (id, type, category_id, status, amount, currency, tva, provider, document_date, notes, image_path, image_remote_url, created_at, updated_at, synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        Object.values(doc)
      );
    }
  }
};