import { showLoader, hideLoader, showAlert } from '../ui.js';

export async function optimizeImage() {
    const input = document.getElementById('opt-file-input') as HTMLInputElement | null;
    const qualityEl = document.getElementById('opt-quality') as HTMLInputElement | null;
    const widthEl = document.getElementById('opt-width') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih gambar dulu.'); return; }
    const file = input.files[0];
    if (!file.type.startsWith('image/')) { showAlert('Bukan gambar', 'Pilih file gambar.'); return; }
    showLoader('Mengoptimalkan gambar...');
    try {
        const img = await createImageBitmap(file);
        const maxWidth = parseInt(widthEl?.value || '0', 10) || img.width;
        const scale = Math.min(1, maxWidth / img.width);
        const quality = parseFloat(qualityEl?.value || '0.8');
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas tidak tersedia');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', quality));
        if (!blob) throw new Error('Konversi gagal');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = file.name.replace(/\.[^.]+$/, '') + '-optimized.jpg';
        a.click();
        URL.revokeObjectURL(a.href);
        hideLoader();
        showAlert('Selesai', `Gambar dioptimalkan (${Math.round(blob.size/1024)} KB).`);
    } catch (e) {
        hideLoader();
        showAlert('Gagal', String(e));
    }
}
