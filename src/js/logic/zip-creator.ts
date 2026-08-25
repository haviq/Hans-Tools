import { showLoader, hideLoader, showAlert } from '../ui.js';

export function createZip() {
    const input = document.getElementById('zip-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih minimal satu file.'); return; }
    const files = Array.from(input.files);
    const win = window as any;
    const ensureLib = (): Promise<void> => new Promise((resolve, reject) => {
        if (win.JSZip) { resolve(); return; }
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Gagal memuat JSZip'));
        document.head.appendChild(s);
    });
    showLoader('Membuat ZIP...');
    ensureLib().then(async () => {
        const zip = new win.JSZip();
        for (const f of files) zip.file(f.name, f);
        const blob = await zip.generateAsync({ type: 'blob' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'archive.zip'; a.click();
        URL.revokeObjectURL(a.href);
        hideLoader(); showAlert('Selesai', 'ZIP berhasil dibuat.');
    }).catch(e => { hideLoader(); showAlert('Gagal', String(e)); });
}
