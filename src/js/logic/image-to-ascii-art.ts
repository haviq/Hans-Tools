import { showLoader, hideLoader, showAlert } from '../ui.js';

export function imageToAscii() {
    const input = document.getElementById('ascii-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih gambar dulu.'); return; }
    const file = input.files[0];
    if (!file.type.startsWith('image/')) { showAlert('Bukan gambar', 'Pilih file gambar.'); return; }
    const out = document.getElementById('ascii-output') as HTMLTextAreaElement | null;
    const chars = (document.getElementById('ascii-chars') as HTMLSelectElement | null)?.value || '@%#*+=-:. ';
    const width = Math.min(Math.max(parseInt((document.getElementById('ascii-width') as HTMLInputElement | null)?.value || '80', 10) || 80, 20), 200);
    showLoader('Mengonversi...');
    createImageBitmap(file).then(img => {
        const canvas = document.createElement('canvas');
        const ratio = img.height / img.width;
        canvas.width = width;
        canvas.height = Math.round(width * ratio * 0.5);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas tidak tersedia');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let ascii = '';
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const idx = (y * canvas.width + x) * 4;
                const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                ascii += chars.charAt(Math.floor((gray / 255) * (chars.length - 1)));
            }
            ascii += '\n';
        }
        if (out) out.value = ascii;
        hideLoader();
    }).catch(e => { hideLoader(); showAlert('Gagal', String(e)); });
}

export function copyAscii() {
    const out = (document.getElementById('ascii-output') as HTMLTextAreaElement | null)?.value || '';
    if (out) navigator.clipboard?.writeText(out);
}

export function setupImageToAsciiArt() {
    document.getElementById('ascii-copy')?.addEventListener('click', copyAscii);
}
