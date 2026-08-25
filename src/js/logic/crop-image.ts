import { showLoader, hideLoader, showAlert } from '../ui.js';

export function cropImage() {
    const input = document.getElementById('crop-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih gambar dulu.'); return; }
    const file = input.files[0];
    if (!file.type.startsWith('image/')) { showAlert('Bukan gambar', 'Pilih file gambar.'); return; }
    const x = parseInt((document.getElementById('crop-x') as HTMLInputElement | null)?.value || '0', 10) || 0;
    const y = parseInt((document.getElementById('crop-y') as HTMLInputElement | null)?.value || '0', 10) || 0;
    const w = parseInt((document.getElementById('crop-w') as HTMLInputElement | null)?.value || '100', 10) || 100;
    const h = parseInt((document.getElementById('crop-h') as HTMLInputElement | null)?.value || '100', 10) || 100;
    showLoader('Cropping...');
    createImageBitmap(file).then(img => {
        const cw = Math.min(w, img.width - x);
        const ch = Math.min(h, img.height - y);
        if (cw <= 0 || ch <= 0) { hideLoader(); showAlert('Gagal', 'Area crop di luar gambar.'); return; }
        const canvas = document.createElement('canvas');
        canvas.width = cw; canvas.height = ch;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas tidak tersedia');
        ctx.drawImage(img, x, y, cw, ch, 0, 0, cw, ch);
        canvas.toBlob(blob => {
            if (!blob) { hideLoader(); showAlert('Gagal', 'Tidak bisa membuat file.'); return; }
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob); a.download = 'crop.jpg'; a.click();
            URL.revokeObjectURL(a.href);
            hideLoader(); showAlert('Selesai', 'Gambar berhasil di-crop.');
        }, 'image/jpeg', 0.92);
    }).catch(e => { hideLoader(); showAlert('Gagal', String(e)); });
}
