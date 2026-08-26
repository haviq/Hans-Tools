import { showAlert } from '../ui.js';
export function generateFavicon() {
    const text = (document.getElementById('fav-text') as HTMLInputElement | null)?.value?.trim() || 'H';
    const bg = (document.getElementById('fav-bg') as HTMLInputElement | null)?.value || '#2563eb';
    const fg = (document.getElementById('fav-fg') as HTMLInputElement | null)?.value || '#ffffff';
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) { showAlert('Gagal', 'Canvas tidak tersedia'); return; }
    ctx.fillStyle = bg;
    ctx.beginPath();
    (ctx as any).roundRect(0, 0, size, size, 56);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.font = 'bold 150px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text.slice(0, 2), size / 2, size / 2 + 10);
    canvas.toBlob(blob => {
        if (!blob) { showAlert('Gagal', 'Tidak bisa membuat file'); return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'favicon.png'; a.click();
        URL.revokeObjectURL(a.href);
    }, 'image/png');
}
