import { showAlert } from '../ui.js';

export function formatJson() { runJson('format'); }
export function minifyJson() { runJson('minify'); }

function runJson(mode: 'format' | 'minify') {
    const input = (document.getElementById('json-input') as HTMLTextAreaElement | null)?.value || '';
    const out = document.getElementById('json-output') as HTMLTextAreaElement | null;
    if (!input.trim()) {
        showAlert('Input Kosong', 'Tempel JSON dulu.');
        return;
    }
    try {
        const parsed = JSON.parse(input);
        if (out) out.value = mode === 'format' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
    } catch (e) {
        showAlert('JSON Invalid', String(e));
    }
}

export function setupJsonFormatter() {
    document.getElementById('json-format')?.addEventListener('click', formatJson);
    document.getElementById('json-minify')?.addEventListener('click', minifyJson);
}
