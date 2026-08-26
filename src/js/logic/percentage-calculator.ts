import { showAlert } from '../ui.js';

export function calculatePercentage() {
    const mode = (document.getElementById('pct-mode') as HTMLSelectElement | null)?.value || 'pct';
    const a = parseFloat((document.getElementById('pct-a') as HTMLInputElement | null)?.value || '');
    const b = parseFloat((document.getElementById('pct-b') as HTMLInputElement | null)?.value || '');
    const out = document.getElementById('pct-output') as HTMLElement | null;
    if (isNaN(a) || isNaN(b) || b === 0) {
        showAlert('Input salah', 'Masukkan dua angka, dan pembagi tidak boleh nol.');
        return;
    }
    let text = '';
    if (mode === 'pct') {
        const res = (a / b) * 100;
        text = `${a} adalah ${res.toFixed(2)}% dari ${b}`;
    } else if (mode === 'add') {
        const res = a + (a * b) / 100;
        text = `${a} + ${b}% = ${res.toFixed(2)}`;
    } else if (mode === 'sub') {
        const res = a - (a * b) / 100;
        text = `${a} - ${b}% = ${res.toFixed(2)}`;
    } else if (mode === 'chg') {
        const res = ((b - a) / a) * 100;
        text = `Perubahan dari ${a} ke ${b} = ${res.toFixed(2)}%`;
    }
    if (out) out.textContent = text;
}
