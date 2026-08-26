import { showAlert } from '../ui.js';
export function generateRandom() {
    const type = (document.getElementById('rand-type') as HTMLSelectElement | null)?.value || 'number';
    const out = document.getElementById('rand-output') as HTMLTextAreaElement | null;
    if (!out) return;
    if (type === 'dice') {
        out.value = 'Hasil dadu: ' + (Math.floor(Math.random() * 6) + 1);
        return;
    }
    if (type === 'choice') {
        const items = ((document.getElementById('rand-items') as HTMLInputElement | null)?.value || 'a,b,c').split(',').map(s => s.trim()).filter(Boolean);
        out.value = 'Pilihan: ' + items[Math.floor(Math.random() * items.length)];
        return;
    }
    const min = parseInt((document.getElementById('rand-min') as HTMLInputElement | null)?.value || '1', 10) || 1;
    const max = parseInt((document.getElementById('rand-max') as HTMLInputElement | null)?.value || '100', 10) || 100;
    if (max <= min) { showAlert('Invalid', 'Max harus > min.'); return; }
    out.value = 'Angka acak: ' + (Math.floor(Math.random() * (max - min + 1)) + min);
}
