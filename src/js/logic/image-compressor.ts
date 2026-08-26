import { showLoader, hideLoader, showAlert } from '../ui.js';

export function compressImage() {
    const input = document.getElementById('cmp-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih gambar dulu.'); return; }
    const file = input.files[0];
    if (!file.type.startsWith('image/')) { showAlert('Bukan gambar', 'Pilih file gambar.'); return; }
    const quality = parseFloat((document.getElementById('cmp-quality') as HTMLInputElement | null)?.value || '0.7') || 0.7;
    const maxWidth = parseInt((document.getElementById('cmp-width') as HTMLInputElement | null)?.value || '0', 10) || 0;
    showLoader('Kompresi gambar...');
    createImageBitmap(file).then(img => {
        const scale = maxWidth > 0 && img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas tidak tersedia');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
            if (!blob) { hideLoader(); showAlert('Gagal', 'Tidak bisa membuat file.'); return; }
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = file.name.replace(/\.[^.]+$/, '') + '-compressed.jpg';
            a.click();
            URL.revokeObjectURL(a.href);
            hideLoader(); showAlert('Selesai', `Ukuran hasil: ${Math.round(blob.size / 1024)} KB`);
        }, 'image/jpeg', quality);
    }).catch(e => { hideLoader(); showAlert('Gagal', String(e)); });
}
