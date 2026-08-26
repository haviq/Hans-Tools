import { showLoader, hideLoader, showAlert } from '../ui.js';

export function removeBackground() {
    const input = document.getElementById('bg-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih gambar dulu.'); return; }
    const file = input.files[0];
    if (!file.type.startsWith('image/')) { showAlert('Bukan gambar', 'Pilih file gambar.'); return; }
    const tolerance = parseFloat((document.getElementById('bg-tolerance') as HTMLInputElement | null)?.value || '30') || 30;
    showLoader('Menghapus background...');
    createImageBitmap(file).then(img => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas tidak tersedia');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imageData.data;
        const pr = d[0], pg = d[1], pb = d[2];
        for (let i = 0; i < d.length; i += 4) {
            if (Math.abs(d[i] - pr) < tolerance && Math.abs(d[i+1] - pg) < tolerance && Math.abs(d[i+2] - pb) < tolerance) {
                d[i+3] = 0;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        canvas.toBlob(blob => {
            if (!blob) { hideLoader(); showAlert('Gagal', 'Tidak bisa membuat file.'); return; }
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob); a.download = 'nobg.png'; a.click();
            URL.revokeObjectURL(a.href);
            hideLoader(); showAlert('Selesai', 'Background dihapus (PNG transparan).');
        }, 'image/png');
    }).catch(e => { hideLoader(); showAlert('Gagal', String(e)); });
}
