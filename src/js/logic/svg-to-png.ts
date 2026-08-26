import { showLoader, hideLoader, showAlert } from '../ui.js';
export function svgToPng() {
    const input = document.getElementById('svg-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih SVG.'); return; }
    const file = input.files[0];
    showLoader('Mengonversi SVG...');
    const reader = new FileReader();
    reader.onload = () => {
        const svgText = String(reader.result);
        const blob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) { hideLoader(); showAlert('Gagal', 'Canvas tidak tersedia'); return; }
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(png => {
                if (!png) { hideLoader(); showAlert('Gagal', 'Konversi gagal'); return; }
                const a = document.createElement('a');
                a.href = URL.createObjectURL(png); a.download = file.name.replace(/\.svg$/i, '') + '.png'; a.click();
                URL.revokeObjectURL(a.href);
                hideLoader(); showAlert('Selesai', 'SVG dikonversi ke PNG.');
            }, 'image/png');
        };
        img.onerror = () => { hideLoader(); showAlert('Gagal', 'SVG tidak bisa dibaca.'); };
        img.src = url;
    };
    reader.onerror = () => { hideLoader(); showAlert('Gagal', 'Tidak bisa membaca file.'); };
    reader.readAsText(file);
}
