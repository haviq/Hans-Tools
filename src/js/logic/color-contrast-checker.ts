import { showAlert } from '../ui.js';
export function checkContrast() {
    const fg = (document.getElementById('cc-fg') as HTMLInputElement | null)?.value || '#ffffff';
    const bg = (document.getElementById('cc-bg') as HTMLInputElement | null)?.value || '#000000';
    const out = document.getElementById('cc-output') as HTMLElement | null;
    const lum = (hex: string) => {
        const h = hex.replace('#', '');
        const f = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
        const [r, g, b] = [0, 2, 4].map(i => parseInt(f.slice(i, i + 2), 16) / 255).map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const l1 = lum(fg), l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const grade = ratio >= 7 ? 'AAA (sangat baik)' : ratio >= 4.5 ? 'AA (baik)' : ratio >= 3 ? 'AA Large' : 'Kurang';
    if (out) out.innerHTML = `<div class="text-2xl font-bold text-sky-300">${ratio.toFixed(2)} : 1</div><div class="text-sm text-slate-300 mt-1">${grade}</div>`;
}
