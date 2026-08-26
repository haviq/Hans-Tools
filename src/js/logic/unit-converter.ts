import { showAlert } from '../ui.js';

const FACTORS: Record<string, number> = {
    mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
    mg: 0.000001, g: 0.001, kg: 1, ton: 1000, lb: 0.45359237, oz: 0.028349523125,
    B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776,
    C: NaN, F: NaN, K: NaN
};

export function convertUnit() {
    const val = parseFloat((document.getElementById('unit-value') as HTMLInputElement | null)?.value || '');
    const from = (document.getElementById('unit-from') as HTMLSelectElement | null)?.value || 'm';
    const to = (document.getElementById('unit-to') as HTMLSelectElement | null)?.value || 'km';
    const out = document.getElementById('unit-output') as HTMLInputElement | null;
    if (isNaN(val)) { showAlert('Input salah', 'Masukkan angka dulu.'); return; }
    let result: number;
    if (['C', 'F', 'K'].includes(from) || ['C', 'F', 'K'].includes(to)) {
        result = convertTemp(val, from, to);
    } else {
        result = (val * (FACTORS[from] ?? 1)) / (FACTORS[to] ?? 1);
    }
    if (out) out.value = String(result);
}

function convertTemp(v: number, from: string, to: string): number {
    let c: number;
    if (from === 'C') c = v;
    else if (from === 'F') c = ((v - 32) * 5) / 9;
    else c = v - 273.15;
    if (to === 'C') return c;
    if (to === 'F') return (c * 9) / 5 + 32;
    return c + 273.15;
}
