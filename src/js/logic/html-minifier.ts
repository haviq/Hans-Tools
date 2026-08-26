import { showAlert } from '../ui.js';
export function minifyHtml() {
    const html = (document.getElementById('html-min-input') as HTMLTextAreaElement | null)?.value || '';
    const out = document.getElementById('html-min-output') as HTMLTextAreaElement | null;
    if (!html.trim()) { showAlert('Input Kosong', 'Tempel HTML.'); return; }
    const min = html.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s{2,}/g, ' ').replace(/\s*([<>{}])\s*/g, '$1').trim();
    if (out) out.value = min;
}
