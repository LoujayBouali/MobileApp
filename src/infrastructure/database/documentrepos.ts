import { getDb } from './database';
import { nanoid } from 'nanoid/non-secure';
import type { Document, DocumentFilters } from '../../shared/types';

export const createDocument = async (doc: Partial<Document>) => {
  const db = getDb();
  const id = nanoid();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO documents
     (id, type, category_id, status, amount, currency, tva, provider, document_date, notes, image_path, created_at, updated_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [id, doc.type ?? 'facture', doc.categoryId ?? null, doc.status ?? 'en_attente',
     doc.amount ?? null, doc.currency ?? 'TND', doc.tva ?? null, doc.provider ?? null,
     doc.documentDate ?? now, doc.notes ?? null, doc.imagePath ?? null, now, now]
  );
  return id;
};

export const updateDocument = async (id: string, doc: Partial<Document>) => {
  const db = getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE documents SET type=?, category_id=?, status=?, amount=?, tva=?, provider=?,
     document_date=?, notes=?, updated_at=?, synced=0 WHERE id=?`,
    [
      doc.type ?? null,
      doc.categoryId ?? null,
      doc.status ?? null,
      doc.amount ?? null,
      doc.tva ?? null,
      doc.provider ?? null,
      doc.documentDate ?? null,
      doc.notes ?? null,
      now,
      id,
    ]
  );
};

export const searchDocuments = async (filters: DocumentFilters) => {
  const db = getDb();
  let query = `SELECT * FROM documents WHERE 1=1`;
  const params: any[] = [];

  if (filters.searchText) {
    query += ` AND (provider LIKE ? OR notes LIKE ?)`;
    params.push(`%${filters.searchText}%`, `%${filters.searchText}%`);
  }
  if (filters.type) { query += ` AND type = ?`; params.push(filters.type); }
  if (filters.categoryId) { query += ` AND category_id = ?`; params.push(filters.categoryId); }
  if (filters.status) { query += ` AND status = ?`; params.push(filters.status); }
  if (filters.dateFrom) { query += ` AND document_date >= ?`; params.push(filters.dateFrom); }
  if (filters.dateTo) { query += ` AND document_date <= ?`; params.push(filters.dateTo); }
  if (filters.amountMin != null) { query += ` AND amount >= ?`; params.push(filters.amountMin); }
  if (filters.amountMax != null) { query += ` AND amount <= ?`; params.push(filters.amountMax); }

  query += ` ORDER BY document_date DESC`;
  return db.getAllAsync(query, params);
};

export const getMonthlyTotal = async (yearMonth: string) => {
  const db = getDb();
  const result = await db.getFirstAsync<{ total: number }>(
    `SELECT SUM(amount) as total FROM documents WHERE strftime('%Y-%m', document_date) = ?`,
    [yearMonth]
  );
  return result?.total ?? 0;
};

export const getSpendingByCategory = async (yearMonth: string) => {
  const db = getDb();
  return db.getAllAsync(
    `SELECT c.name, c.icon, SUM(d.amount) as total
     FROM documents d JOIN categories c ON d.category_id = c.id
     WHERE strftime('%Y-%m', d.document_date) = ?
     GROUP BY c.id ORDER BY total DESC`,
    [yearMonth]
  );
};

export const getMonthlyEvolution = async (monthsCount: number = 6) => {
  const db = getDb();
  return db.getAllAsync(
    `SELECT strftime('%Y-%m', document_date) as month, SUM(amount) as total
     FROM documents
     WHERE document_date >= date('now', '-${monthsCount} months')
     GROUP BY month ORDER BY month ASC`
  );
};