import { showAlert } from '../ui.js';

export function csvToTable() {
    const src = (document.getElementById('csvt-input') as HTMLTextAreaElement | null)?.value || '';
    const out = document.getElementById('csvt-output') as HTMLElement | null;
    if (!src.trim()) { showAlert('Input Kosong', 'Tempel CSV dulu.'); return; }
    const lines = src.split(/\r?\n/).filter(l => l.trim());
    if (!lines.length) return;
    const rows = lines.map(l => l.split(',').map(c => c.trim()));
    let html = '<table class="w-full text-sm text-slate-300 border-collapse">';
    rows.forEach((row, i) => {
        html += '<tr>';
        row.forEach(cell => {
            if (i === 0) html += `<th class="border border-slate-700 px-2 py-1 text-left text-sky-300">${escapeHtml(cell)}</th>`;
            else html += `<td class="border border-slate-700 px-2 py-1">${escapeHtml(cell)}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    if (out) out.innerHTML = html;
}

function escapeHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
