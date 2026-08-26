import { showAlert } from '../ui.js';
export function calculate() {
    const expr = (document.getElementById('calc-input') as HTMLInputElement | null)?.value?.trim();
    const out = document.getElementById('calc-output') as HTMLElement | null;
    if (!expr) { showAlert('Input Kosong', 'Masukkan ekspresi.'); return; }
    try {
        const sanitized = expr.replace(/[^0-9+\-*/().^% ]/g, '').replace(/\^/g, '**');
        const result = Function('return (' + sanitized + ')')();
        if (out) out.textContent = '= ' + String(result);
    } catch { showAlert('Invalid', 'Ekspresi tidak valid.'); }
}
