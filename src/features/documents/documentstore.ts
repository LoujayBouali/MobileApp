import { create } from 'zustand';
import * as repo from '../../infrastructure/database/documentrepos';
import type { Document, DocumentFilters } from '../../shared/types';

interface DocumentState {
  documents: Document[];
  filters: DocumentFilters;
  isLoading: boolean;
  loadDocuments: () => Promise<void>;
  setFilters: (filters: Partial<DocumentFilters>) => void;
  addDocument: (doc: Partial<Document>) => Promise<string>;
  editDocument: (id: string, doc: Partial<Document>) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  filters: {},
  isLoading: false,

  loadDocuments: async () => {
    set({ isLoading: true });
    const docs = await repo.searchDocuments(get().filters);
    set({ documents: docs as Document[], isLoading: false });
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().loadDocuments();
  },

  addDocument: async (doc) => {
    const id = await repo.createDocument(doc);
    await get().loadDocuments();
    return id;
  },

  editDocument: async (id, doc) => {
    await repo.updateDocument(id, doc);
    await get().loadDocuments();
  },
}));