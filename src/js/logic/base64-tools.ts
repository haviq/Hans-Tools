import { showAlert } from '../ui.js';

export function b64Encode() { runBase64('encode'); }
export function b64Decode() { runBase64('decode'); }

function runBase64(mode: 'encode' | 'decode') {
    const input = (document.getElementById('b64-input') as HTMLTextAreaElement | null)?.value || '';
    const out = document.getElementById('b64-output') as HTMLTextAreaElement | null;
    if (!input) {
        showAlert('Input Kosong', 'Masukkan teks/base64 dulu.');
        return;
    }
    try {
        if (mode === 'encode') {
            if (out) out.value = btoa(unescape(encodeURIComponent(input)));
        } else {
            if (out) out.value = decodeURIComponent(escape(atob(input.trim())));
        }
    } catch {
        showAlert('Gagal', 'Base64 tidak valid.');
    }
}

export function setupBase64Tools() {
    document.getElementById('b64-encode')?.addEventListener('click', b64Encode);
    document.getElementById('b64-decode')?.addEventListener('click', b64Decode);
}
