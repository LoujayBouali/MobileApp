export interface Document {
  id: string;
  type: 'facture' | 'reçu' | 'devis' | 'bon_de_commande' | 'contrat' | 'autre';
  categoryId: string | null;
  status: 'en_attente' | 'payee' | 'remboursee' | 'annulee';
  amount: number | null;
  currency: string;
  tva: number | null;
  provider: string | null;
  documentDate: string;
  notes: string | null;
  imagePath: string | null;
  imageRemoteUrl: string | null;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
}