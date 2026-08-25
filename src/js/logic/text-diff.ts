import { showAlert } from '../ui.js';

export function runTextDiff() {
    const a = (document.getElementById('diff-a') as HTMLTextAreaElement | null)?.value || '';
    const b = (document.getElementById('diff-b') as HTMLTextAreaElement | null)?.value || '';
    const out = document.getElementById('diff-output') as HTMLTextAreaElement | null;
    if (!a && !b) { showAlert('Input Kosong', 'Masukkan dua teks untuk dibandingkan.'); return; }
    const la = a.split('\n');
    const lb = b.split('\n');
    const max = Math.max(la.length, lb.length);
    const lines: string[] = [];
    for (let i = 0; i < max; i++) {
        const x = la[i] ?? '';
        const y = lb[i] ?? '';
        if (i >= la.length) lines.push(`+ ${y}`);
        else if (i >= lb.length) lines.push(`- ${x}`);
        else if (x === y) lines.push(`  ${x}`);
        else { lines.push(`- ${x}`); lines.push(`+ ${y}`); }
    }
    if (out) out.value = lines.join('\n');
}
