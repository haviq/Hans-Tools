import { showAlert } from '../ui.js';

export function renderMarkdown() {
    const src = (document.getElementById('mdp-input') as HTMLTextAreaElement | null)?.value || '';
    const out = document.getElementById('mdp-output') as HTMLElement | null;
    if (!src.trim()) { showAlert('Input Kosong', 'Masukkan markdown dulu.'); return; }
    const win = window as any;
    const ensureLib = (): Promise<void> => new Promise((resolve, reject) => {
        if (win.marked) { resolve(); return; }
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Gagal memuat marked'));
        document.head.appendChild(s);
    });
    ensureLib().then(() => {
        if (out) out.innerHTML = win.marked.parse(src);
    }).catch(e => showAlert('Gagal', String(e)));
}

export function downloadMarkdownPreview() {
    const src = (document.getElementById('mdp-input') as HTMLTextAreaElement | null)?.value || '';
    const blob = new Blob([src], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'dokumen.md'; a.click();
    URL.revokeObjectURL(a.href);
}

export function setupMarkdownPreview() {
    document.getElementById('mdp-download')?.addEventListener('click', downloadMarkdownPreview);
}
