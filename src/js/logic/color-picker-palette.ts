import { showAlert } from '../ui.js';

export function generatePalette() {
    const base = (document.getElementById('cp-base') as HTMLInputElement | null)?.value || '#3366ff';
    const out = document.getElementById('cp-output') as HTMLElement | null;
    let hx = base.replace('#', '');
    if (hx.length === 3) hx = hx.split('').map(c => c + c).join('');
    if (!/^[0-9a-fA-F]{6}$/.test(hx)) { showAlert('Invalid', 'Hex tidak valid.'); return; }
    const r = parseInt(hx.slice(0, 2), 16);
    const g = parseInt(hx.slice(2, 4), 16);
    const b = parseInt(hx.slice(4, 6), 16);
    if (!out) return;
    const shades = [0.1, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    let html = '<div class="grid grid-cols-9 gap-1">';
    shades.forEach(s => {
        const nr = Math.min(255, Math.round(r * s));
        const ng = Math.min(255, Math.round(g * s));
        const nb = Math.min(255, Math.round(b * s));
        const hex = `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`;
        html += `<div class="h-12 rounded" style="background:${hex}" title="${hex}"></div>`;
    });
    html += '</div>';
    html += `<div class="mt-2 text-sm text-slate-400">Palette dari ${base} — ${shades.length} shades</div>`;
    out.innerHTML = html;
}
