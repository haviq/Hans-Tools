import { showLoader, hideLoader, showAlert } from '../ui.js';

export async function generateBarcode() {
    const text = (document.getElementById('barcode-text') as HTMLInputElement | null)?.value?.trim();
    const format = (document.getElementById('barcode-format') as HTMLSelectElement | null)?.value || 'CODE128';
    const out = document.getElementById('barcode-output') as HTMLElement | null;
    if (!text) { showAlert('Input Kosong', 'Masukkan teks/angka untuk barcode.'); return; }
    const win = window as any;
    showLoader('Membuat barcode...');
    try {
        if (!win.JsBarcode) {
            await new Promise<void>((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js';
                s.onload = () => resolve();
                s.onerror = () => reject(new Error('Gagal memuat JsBarcode'));
                document.head.appendChild(s);
            });
        }
        if (!out) { hideLoader(); return; }
        out.innerHTML = '<svg id="barcode-svg"></svg>';
        await win.JsBarcode('#barcode-svg', text, { format, height: 60, width: 2, displayValue: true });
        hideLoader();
    } catch (e) {
        hideLoader(); showAlert('Gagal', String(e));
    }
}

export function downloadBarcode() {
    const svg = document.getElementById('barcode-svg') as unknown as SVGElement | null;
    if (!svg) { showAlert('Barcode kosong', 'Generate barcode dulu.'); return; }
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'barcode.svg';
    a.click();
    URL.revokeObjectURL(a.href);
}

export function setupBarcodeGenerator() {
    document.getElementById('barcode-download')?.addEventListener('click', downloadBarcode);
}
