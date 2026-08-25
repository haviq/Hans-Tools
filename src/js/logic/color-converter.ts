import { showAlert } from '../ui.js';

export function convertColor() {
    const hex = (document.getElementById('color-hex') as HTMLInputElement | null)?.value || '#3366ff';
    const out = document.getElementById('color-output') as HTMLTextAreaElement | null;
    let hx = hex.replace('#', '');
    if (hx.length === 3) hx = hx.split('').map(c => c + c).join('');
    if (!/^[0-9a-fA-F]{6}$/.test(hx)) { showAlert('Invalid', 'Hex tidak valid.'); return; }
    const r = parseInt(hx.slice(0, 2), 16);
    const g = parseInt(hx.slice(2, 4), 16);
    const b = parseInt(hx.slice(4, 6), 16);
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    let hue = 0, sat = 0;
    if (max !== min) {
        const d = max - min;
        sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        hue = rn === max ? (gn - bn) / d + (gn < bn ? 6 : 0) : gn === max ? (bn - rn) / d + 2 : (rn - gn) / d + 4;
        hue *= 60;
    }
    if (out) out.value = `RGB: (${r}, ${g}, ${b})\nHEX: #${hx}\nHSL: (${Math.round(hue)}°, ${Math.round(sat * 100)}%, ${Math.round(l * 100)}%)`;
}
