import { showAlert } from '../ui.js';

export function testRegex() {
    const pattern = (document.getElementById('regex-pattern') as HTMLInputElement | null)?.value || '';
    const flags = (document.getElementById('regex-flags') as HTMLInputElement | null)?.value || 'g';
    const text = (document.getElementById('regex-text') as HTMLTextAreaElement | null)?.value || '';
    const out = document.getElementById('regex-output') as HTMLElement | null;
    if (!pattern) { showAlert('Pattern kosong', 'Masukkan regex pattern.'); return; }
    try {
        const re = new RegExp(pattern, flags);
        const matches = Array.from(text.matchAll(re)).map(m => `Match: "${m[0]}" at index ${m.index}`);
        if (out) out.innerHTML = matches.length
            ? matches.join('<br>')
            : '<span class="text-gray-400">Tidak ada match</span>';
    } catch (e) {
        if (out) out.textContent = 'Regex Error: ' + String(e);
    }
}

export function copyRegexResult() {
    const out = (document.getElementById('regex-output') as HTMLElement | null)?.textContent || '';
    if (out) navigator.clipboard?.writeText(out);
}

export function setupRegexTester() {
    document.getElementById('regex-copy')?.addEventListener('click', copyRegexResult);
}
