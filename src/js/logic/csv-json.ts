import { showAlert } from '../ui.js';

export function setupCsvJson() {
    document.getElementById('csv-to-json')?.addEventListener('click', csvToJson);
    document.getElementById('json-to-csv')?.addEventListener('click', jsonToCsv);
}

export function csvToJson() {
    const data = (document.getElementById('csv-input') as HTMLTextAreaElement | null)?.value || '';
    const out = document.getElementById('csv-output') as HTMLTextAreaElement | null;
    if (!data) { showAlert('Input Kosong', 'Tempel CSV dulu.'); return; }
    const lines = data.split(/\r?\n/).filter(l => l.trim());
    if (!lines.length) { showAlert('Input Kosong', 'CSV kosong.'); return; }
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
        return obj;
    });
    if (out) out.value = JSON.stringify(rows, null, 2);
}

export function jsonToCsv() {
    const data = (document.getElementById('csv-input') as HTMLTextAreaElement | null)?.value || '';
    const out = document.getElementById('csv-output') as HTMLTextAreaElement | null;
    if (!data) { showAlert('Input Kosong', 'Tempel JSON dulu.'); return; }
    try {
        const arr = JSON.parse(data);
        if (!Array.isArray(arr) || !arr.length) { showAlert('Invalid', 'JSON harus array of object.'); return; }
        const headers = Object.keys(arr[0]);
        const lines = [headers.join(','), ...arr.map(o => headers.map(h => String(o[h] ?? '')).join(','))];
        if (out) out.value = lines.join('\n');
    } catch (e) { showAlert('Invalid JSON', String(e)); }
}
