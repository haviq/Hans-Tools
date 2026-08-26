import { showAlert } from '../ui.js';

export function parseCsvEditor() {
    const src = (document.getElementById('cse-input') as HTMLTextAreaElement | null)?.value || '';
    const wrap = document.getElementById('cse-table') as HTMLElement | null;
    if (!src.trim()) { showAlert('Input Kosong', 'Tempel CSV dulu.'); return; }
    const lines = src.split(/\r?\n/).filter(l => l.trim());
    if (!lines.length) return;
    const html = lines.map((line, i) => {
        const cells = line.split(',').map(c => c.trim());
        const tag = i === 0 ? 'th' : 'td';
        return '<tr>' + cells.map(c => `<${tag} class="border border-slate-700 px-2 py-1">${escapeHtml(c)}</${tag}>`).join('') + '</tr>';
    }).join('');
    if (wrap) wrap.innerHTML = `<table class="w-full text-sm text-slate-300 border-collapse">${html}</table>`;
}

export function exportCsvEditor() {
    const rows = Array.from(document.querySelectorAll('#cse-table tr')) as HTMLTableRowElement[];
    if (!rows.length) { showAlert('Belum ada CSV', 'Tempel CSV dan parse dulu.'); return; }
    const csv = rows.map(row =>
        Array.from(row.cells).map(c => c.textContent || '').join(',')
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(a.href);
}

export function setupCsvEditor() {
    document.getElementById('cse-export')?.addEventListener('click', exportCsvEditor);
}

function escapeHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
