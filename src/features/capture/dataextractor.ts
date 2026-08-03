export const extractInvoiceData = (text: string) => {
  const amountRegex = /(?:total|montant|net à payer)\s*[:\s]*([\d\s]+[,.]\d{2})/i;
  const amountMatch = text.match(amountRegex);
  const amount = amountMatch
    ? parseFloat(amountMatch[1].replace(/\s/g, '').replace(',', '.'))
    : null;

  const tvaRegex = /(?:tva|t\.v\.a)\s*[:\s]*([\d\s]+[,.]\d{2})/i;
  const tvaMatch = text.match(tvaRegex);
  const tva = tvaMatch ? parseFloat(tvaMatch[1].replace(/\s/g, '').replace(',', '.')) : null;

  const dateRegex = /\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})\b/;
  const dateMatch = text.match(dateRegex);
  const date = dateMatch ? normalizeDate(dateMatch[1]) : null;

  const lines = text.split('\n').filter((l) => l.trim().length > 2);
  const provider = lines.length > 0 ? lines[0].trim() : null;

  // Score de confiance simple — utile pour l'UI de correction
  const confidence = {
    amount: amount !== null,
    date: date !== null,
    provider: provider !== null,
  };

  return { amount, tva, date, provider, confidence };
};

const normalizeDate = (raw: string): string => {
  const parts = raw.split(/[\/\-.]/);
  if (parts.length === 3) {
    let [d, m, y] = parts;
    if (y.length === 2) y = `20${y}`;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return raw;
};