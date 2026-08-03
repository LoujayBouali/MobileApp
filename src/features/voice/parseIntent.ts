export type IntentResult =
  | { action: 'create'; type: string; fournisseur: string; montant: number; source?: string }
  | { action: 'update'; filtre: { fournisseur?: string; id?: number }; champ: string; valeur: string | number }
  | { action: 'query'; type: 'sum' | 'list' | 'search'; periode?: string; filtre?: string }
  | { action: 'navigate'; ecran: string }
  | { action: 'delete'; confirmation_requise: boolean; filtre?: { statut?: string } }
  | { action: 'unknown'; raw: string };

export function parseIntent(text: string): IntentResult {
  const t = text.toLowerCase().trim();

  console.log('Parsing intent for:', t);

  if (t.includes('supprime') || t.includes('efface') || t.includes('enlève')) {
    if (t.includes('dernière') || t.includes('derniere')) {
      return {
        action: 'delete',
        confirmation_requise: true,
        filtre: { statut: 'last' },
      };
    }
    return {
      action: 'delete',
      confirmation_requise: true,
    };
  }

  if (
    t.includes('ajoute') ||
    t.includes('nouvelle') ||
    t.includes('scanne') ||
    t.includes('crée') ||
    t.includes('creer')
  ) {
    const montantMatch = t.match(/(\d+[.,]?\d*)/);
    const montant = montantMatch ? parseFloat(montantMatch[0].replace(',', '.')) : 0;
    let fournisseur = 'inconnu';
    const factureMatch = t.match(/facture\s+([a-zA-Zéèêëàâôûîïç\s]+?)\s+de/i);
    if (factureMatch) {
      fournisseur = factureMatch[1].trim();
    } else {
      const deMatch = t.match(/(?:depense|pour|de)\s+([a-zA-Zéèêëàâôûîïç\s]+?)(?:\s+\d+)/i);
      if (deMatch) {
        fournisseur = deMatch[1].trim();
      }
    }

    const source = t.includes('scanne') ? 'camera' : 'manuel';

    return {
      action: 'create',
      type: 'facture',
      fournisseur: fournisseur,
      montant: montant,
      source: source,
    };
  }

  if (
    t.includes('marque') ||
    t.includes('change') ||
    t.includes('modifie') ||
    t.includes('met à jour') ||
    t.includes('passe')
  ) {
    let champ = 'statut';
    let valeur: string | number = 'modifié';

    if (t.includes('payée') || t.includes('payee') || t.includes('payé')) {
      champ = 'statut';
      valeur = 'payee';
    }
    else if (t.includes('montant')) {
      champ = 'montant';
      const montantMatch = t.match(/(\d+[.,]?\d*)/);
      valeur = montantMatch ? parseFloat(montantMatch[0].replace(',', '.')) : 0;
    }
    else if (t.includes('note') || t.includes('commentaire')) {
      champ = 'note';
      const noteMatch = t.match(/note\s*[:]\s*(.+)/i) || t.match(/commentaire\s*[:]\s*(.+)/i);
      valeur = noteMatch ? noteMatch[1].trim() : 'note ajoutée';
    }

    let filtre = {};
    const fournisseurMatch = t.match(/facture\s+([a-zA-Zéèêëàâôûîïç\s]+?)(?:\s+(?:comme|en))/i);
    if (fournisseurMatch) {
      filtre = { fournisseur: fournisseurMatch[1].trim() };
    } else if (t.includes('dernière') || t.includes('derniere')) {
      filtre = { id: -1 };
    }

    return {
      action: 'update',
      filtre: filtre,
      champ: champ,
      valeur: valeur,
    };
  }

 
  if (
    t.includes('combien') ||
    t.includes('depense') ||
    t.includes('dépense') ||
    t.includes('total') ||
    t.includes('montre') ||
    t.includes('affiche') ||
    t.includes('trouve') ||
    t.includes('cherche')
  ) {

    if (t.includes('combien') || t.includes('total') || t.includes('depense')) {
      let periode = 'tous';
      if (t.includes('mois') || t.includes('ce mois')) {
        periode = 'mois_courant';
      } else if (t.includes('jour') || t.includes('aujourd')) {
        periode = 'jour_courant';
      } else if (t.includes('semaine')) {
        periode = 'semaine_courante';
      }
      return {
        action: 'query',
        type: 'sum',
        periode: periode,
      };
    }
    if (t.includes('attente') || t.includes('non payée') || t.includes('impayé')) {
      return {
        action: 'query',
        type: 'list',
        filtre: 'en_attente',
      };
    }
    if (t.includes('payée') || t.includes('payee') || t.includes('payé')) {
      return {
        action: 'query',
        type: 'list',
        filtre: 'payee',
      };
    }

    const searchMatch = t.match(/facture\s+([a-zA-Zéèêëàâôûîïç\s]+?)(?:\s+de)?/i);
    if (searchMatch) {
      return {
        action: 'query',
        type: 'search',
        filtre: searchMatch[1].trim(),
      };
    }

    return {
      action: 'query',
      type: 'list',
      periode: 'tous',
    };
  }

  if (
    t.includes('dashboard') ||
    t.includes('statistiques') ||
    t.includes('stats') ||
    t.includes('accueil') ||
    t.includes('retour') ||
    t.includes('annule') ||
    t.includes('home')
  ) {
    let ecran = 'home';
    if (t.includes('dashboard')) ecran = 'dashboard';
    else if (t.includes('statistiques') || t.includes('stats')) ecran = 'stats';
    else if (t.includes('retour')) ecran = 'back';
    else if (t.includes('annule')) ecran = 'cancel';

    return {
      action: 'navigate',
      ecran: ecran,
    };
  }

  
  console.warn('Intention non reconnue, fallback vers Wit.ai');
  return {
    action: 'unknown',
    raw: text,
  };
}