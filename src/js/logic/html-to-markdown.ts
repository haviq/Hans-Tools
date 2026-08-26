import { showLoader, hideLoader, showAlert } from '../ui.js';

export async function htmlToMarkdown() {
    const html = (document.getElementById('h2m-input') as HTMLTextAreaElement | null)?.value || '';
    const out = document.getElementById('h2m-output') as HTMLTextAreaElement | null;
    if (!html.trim()) { showAlert('Input Kosong', 'Tempel HTML dulu.'); return; }
    const win = window as any;
    showLoader('Konversi HTML ke Markdown...');
    try {
        if (!win.TurndownService) {
            await new Promise<void>((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js';
                s.onload = () => resolve();
                s.onerror = () => reject(new Error('Gagal memuat Turndown'));
                document.head.appendChild(s);
            });
        }
        const td = new win.TurndownService({ headingStyle: 'atx' });
        if (out) out.value = td.turndown(html);
        hideLoader();
    } catch (e) {
        hideLoader(); showAlert('Gagal', String(e));
    }
}

export function copyHtmlToMarkdown() {
    const out = (document.getElementById('h2m-output') as HTMLTextAreaElement | null)?.value || '';
    if (!out) return;
    navigator.clipboard?.writeText(out);
}

export function setupHtmlToMarkdown() {
    document.getElementById('h2m-copy')?.addEventListener('click', copyHtmlToMarkdown);
}
