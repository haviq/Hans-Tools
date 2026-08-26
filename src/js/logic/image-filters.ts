import { showLoader, hideLoader, showAlert } from '../ui.js';

export function applyFilter() {
    const input = document.getElementById('filter-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih gambar dulu.'); return; }
    const file = input.files[0];
    if (!file.type.startsWith('image/')) { showAlert('Bukan gambar', 'Pilih file gambar.'); return; }
    const filter = (document.getElementById('filter-type') as HTMLSelectElement | null)?.value || 'grayscale';
    showLoader('Menerapkan filter...');
    createImageBitmap(file).then(img => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas tidak tersedia');
        ctx.drawImage(img, 0, 0);
        const filters: Record<string, string> = {
            grayscale: 'grayscale(100%)',
            sepia: 'sepia(100%)',
            invert: 'invert(100%)',
            brightness: 'brightness(1.5)',
            contrast: 'contrast(1.5)',
            blur: 'blur(2px)'
        };
        ctx.filter = filters[filter] || 'none';
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
            if (!blob) { hideLoader(); showAlert('Gagal', 'Tidak bisa membuat file.'); return; }
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = file.name.replace(/\.[^.]+$/, '') + '-' + filter + '.jpg';
            a.click();
            URL.revokeObjectURL(a.href);
            hideLoader(); showAlert('Selesai', 'Gambar berhasil di-filter.');
        }, 'image/jpeg', 0.92);
    }).catch(e => { hideLoader(); showAlert('Gagal', String(e)); });
}
