import { showLoader, hideLoader, showAlert } from '../ui.js';

export function rotateImage() {
    const input = document.getElementById('rotate-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih gambar dulu.'); return; }
    const file = input.files[0];
    if (!file.type.startsWith('image/')) { showAlert('Bukan gambar', 'Pilih file gambar.'); return; }
    const deg = parseInt((document.getElementById('rotate-deg') as HTMLSelectElement | null)?.value || '90', 10) || 90;
    showLoader('Memutar gambar...');
    createImageBitmap(file).then(img => {
        const radians = (deg * Math.PI) / 180;
        const w = Math.round(Math.abs(img.width * Math.cos(radians)) + Math.abs(img.height * Math.sin(radians)));
        const h = Math.round(Math.abs(img.height * Math.cos(radians)) + Math.abs(img.width * Math.sin(radians)));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas tidak tersedia');
        ctx.translate(w / 2, h / 2);
        ctx.rotate(radians);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        canvas.toBlob(blob => {
            if (!blob) { hideLoader(); showAlert('Gagal', 'Tidak bisa membuat file.'); return; }
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = file.name.replace(/\.[^.]+$/, '') + '-rotated.jpg';
            a.click();
            URL.revokeObjectURL(a.href);
            hideLoader(); showAlert('Selesai', 'Gambar berhasil diputar.');
        }, 'image/jpeg', 0.92);
    }).catch(e => { hideLoader(); showAlert('Gagal', String(e)); });
}
