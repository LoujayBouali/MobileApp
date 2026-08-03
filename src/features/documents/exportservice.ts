import ExcelJS from 'exceljs';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const exportMonthlyReportPdf = async (documents: any[], monthLabel: string) => {
  const rows = documents.map((d) =>
    `<tr><td>${d.document_date}</td><td>${d.provider}</td><td>${d.amount} TND</td></tr>`
  ).join('');

  const html = `
    <html><body>
      <h1>Rapport - ${monthLabel}</h1>
      <table border="1" style="width:100%; border-collapse:collapse;">
        <tr><th>Date</th><th>Fournisseur</th><th>Montant</th></tr>
        ${rows}
      </table>
    </body></html>
  `;

  const { Print } = await import('expo-print');
  const { uri } = await Print.printToFileAsync({ html });
  const { shareAsync } = await import('expo-sharing');
  await shareAsync(uri);
};

export const exportToExcel = async (documents: any[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Documents');

  sheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Fournisseur', key: 'provider', width: 25 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Catégorie', key: 'category', width: 15 },
    { header: 'Montant', key: 'amount', width: 12 },
    { header: 'TVA', key: 'tva', width: 10 },
    { header: 'Statut', key: 'status', width: 15 },
  ];

  documents.forEach((doc) => {
    sheet.addRow({
      date: doc.document_date,
      provider: doc.provider,
      type: doc.type,
      category: doc.category_name,
      amount: doc.amount,
      tva: doc.tva,
      status: doc.status,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const path = `${FileSystem.cacheDirectory}export_${Date.now()}.xlsx`;
  await FileSystem.writeAsStringAsync(path, base64, { encoding: FileSystem.EncodingType.Base64 });
  await Sharing.shareAsync(path);
};