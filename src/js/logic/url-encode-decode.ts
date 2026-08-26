import { showAlert } from '../ui.js';
export function urlEncode() { runUrl('encode'); }
export function urlDecode() { runUrl('decode'); }
function runUrl(mode: 'encode' | 'decode') {
    const input = (document.getElementById('url-input') as HTMLTextAreaElement | null)?.value || '';
    const out = document.getElementById('url-output') as HTMLTextAreaElement | null;
    if (!input) { showAlert('Input Kosong', 'Tempel teks.'); return; }
    try {
        if (mode === 'encode') { if (out) out.value = encodeURIComponent(input); }
        else { if (out) out.value = decodeURIComponent(input); }
    } catch { showAlert('Gagal', 'Tidak bisa decode URL.'); }
}
export function setupUrlTools() {
    document.getElementById('url-encode')?.addEventListener('click', urlEncode);
    document.getElementById('url-decode')?.addEventListener('click', urlDecode);
}
