import XLSX from 'xlsx';

export const SHEETS = [
  'POC Summary','Customer Environment','Customer Requirement','POC Entry Checklist',
  'POC Exit Checklist','POC Report','Client Concerns','Client Sign-off'
];

export function workbookToData(buffer) {
  const wb = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const out = {};
  for (const name of SHEETS) {
    const ws = wb.Sheets[name];
    if (ws) out[name] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  }
  return out;
}

export function dataToWorkbook(data) {
  const wb = XLSX.utils.book_new();
  for (const name of SHEETS) {
    const rows = data[name] || [[]];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0,31));
  }
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}
