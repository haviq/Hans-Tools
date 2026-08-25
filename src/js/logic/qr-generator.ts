import { showLoader, hideLoader, showAlert } from '../ui.js';

export function generateQr() {
    const text = (document.getElementById('qr-text') as HTMLInputElement | null)?.value?.trim();
    const out = document.getElementById('qr-output') as HTMLElement | null;
    const dl = document.getElementById('qr-download') as HTMLAnchorElement | null;
    if (!text) {
        showAlert('Input Kosong', 'Masukkan teks atau URL dulu.');
        return;
    }
    const win = window as any;
    const ensureLib = (): Promise<void> => new Promise((resolve, reject) => {
        if (win.QRCode) { resolve(); return; }
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Gagal memuat library QR Code'));
        document.head.appendChild(s);
    });

    showLoader('Membuat QR Code...');
    ensureLib()
        .then(() => new Promise<void>((resolve) => {
            const canvas = document.createElement('canvas');
            win.QRCode.toCanvas(canvas, text, {
                width: 256,
                margin: 2,
                color: { dark: '#0f172a', light: '#ffffff' }
            }, () => {
                if (out) { out.innerHTML = ''; out.appendChild(canvas); }
                if (dl) { dl.href = canvas.toDataURL('image/png'); dl.classList.remove('hidden'); }
                resolve();
            });
        }))
        .then(() => hideLoader())
        .catch((e: any) => { hideLoader(); showAlert('Gagal', String(e)); });
}
