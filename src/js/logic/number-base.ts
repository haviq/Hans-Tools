import { showAlert } from '../ui.js';

export function convertBase() {
    const value = (document.getElementById('base-input') as HTMLInputElement | null)?.value || '';
    const from = (document.getElementById('base-from') as HTMLSelectElement | null)?.value || '10';
    const out = document.getElementById('base-output') as HTMLTextAreaElement | null;
    if (!value.trim()) { showAlert('Input Kosong', 'Masukkan angka dulu.'); return; }
    const dec = parseInt(value, parseInt(from, 10));
    if (isNaN(dec)) { showAlert('Invalid', 'Angka tidak valid untuk basis tersebut.'); return; }
    if (!out) return;
    out.value = `\nDesimal: ${dec}\nBiner: ${dec.toString(2)}\nOktal: ${dec.toString(8)}\nHeksadesimal: ${dec.toString(16).toUpperCase()}`;
}
