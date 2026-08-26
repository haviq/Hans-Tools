import { showAlert } from '../ui.js';
export function csvToSql() {
    const csv = (document.getElementById('csql-input') as HTMLTextAreaElement | null)?.value || '';
    const table = (document.getElementById('csql-table') as HTMLInputElement | null)?.value?.trim() || 'my_table';
    const out = document.getElementById('csql-output') as HTMLTextAreaElement | null;
    if (!csv.trim()) { showAlert('Input Kosong', 'Tempel CSV.'); return; }
    const lines = csv.split(/\r?\n/).filter(l => l.trim());
    if (!lines.length) return;
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => line.split(',').map(v => v.trim()));
    const esc = (v: string) => "'" + v.replace(/'/g, "''") + "'";
    const sql = rows.map(row => `INSERT INTO ${table} (${headers.join(', ')}) VALUES (${row.map(esc).join(', ')});`).join('\n');
    if (out) out.value = sql;
}
