import { showAlert } from '../ui.js';

export function generateTable() {
    const cols = Math.min(Math.max(parseInt((document.getElementById('mt-cols') as HTMLInputElement | null)?.value || '3', 10) || 3, 1), 10);
    const rows = Math.min(Math.max(parseInt((document.getElementById('mt-rows') as HTMLInputElement | null)?.value || '3', 10) || 3, 1), 20);
    const headers = (document.getElementById('mt-headers') as HTMLInputElement | null)?.value || '';
    const out = document.getElementById('mt-output') as HTMLTextAreaElement | null;
    if (!out) return;
    const headerArr = headers.split(',').map(h => h.trim()).filter(Boolean);
    const colsN = headerArr.length >= 1 ? headerArr.length : cols;
    const normalizedHeaders = headerArr.length >= 1 ? headerArr : Array.from({ length: cols }, (_v, i) => 'Kolom ' + (i + 1));
    let md = '| ' + normalizedHeaders.join(' | ') + ' |\n';
    md += '| ' + normalizedHeaders.map(() => '---').join(' | ') + ' |\n';
    for (let r = 1; r <= rows; r++) {
        const cells = normalizedHeaders.map((_h, c) => headerArr.length >= 1 && headerArr.length < colsN ? ' ' : `Data ${r}-${c + 1}`);
        md += '| ' + cells.join(' | ') + ' |\n';
    }
    out.value = md;
}

export function copyTable() {
    const out = (document.getElementById('mt-output') as HTMLTextAreaElement | null)?.value || '';
    if (out) navigator.clipboard?.writeText(out);
}

export function setupMarkdownTable() {
    document.getElementById('mt-copy')?.addEventListener('click', copyTable);
}
