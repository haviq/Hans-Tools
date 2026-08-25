import { showLoader, hideLoader, showAlert } from '../ui.js';

export async function generateHash() {
    const input = (document.getElementById('hash-input') as HTMLTextAreaElement | null)?.value;
    const algo = (document.getElementById('hash-algo') as HTMLSelectElement | null)?.value || 'SHA-256';
    const out = document.getElementById('hash-output') as HTMLTextAreaElement | null;
    if (!input) {
        showAlert('Input Kosong', 'Masukkan teks dulu.');
        return;
    }
    showLoader('Menghitung hash...');
    try {
        let hex: string;
        if (algo === 'MD5') {
            const win = window as any;
            if (!win.CryptoJS) {
                await new Promise<void>((resolve, reject) => {
                    const s = document.createElement('script');
                    s.src = 'https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js';
                    s.onload = () => resolve();
                    s.onerror = () => reject(new Error('Gagal memuat crypto-js'));
                    document.head.appendChild(s);
                });
            }
            hex = win.CryptoJS.MD5(input).toString();
        } else {
            const data = new TextEncoder().encode(input);
            const buf = await crypto.subtle.digest(algo, data);
            hex = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
        }
        if (out) out.value = hex;
        hideLoader();
    } catch (e) {
        hideLoader();
        showAlert('Gagal', String(e));
    }
}
