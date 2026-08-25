import { showAlert } from '../ui.js';

export function setupMarkdownEditor() {
    const src = document.getElementById('md-src') as HTMLTextAreaElement | null;
    const preview = document.getElementById('md-preview');
    if (!src || !preview) return;
    const render = () => {
        const text = src.value || '';
        preview.innerHTML = `<pre class="text-sm text-slate-300 whitespace-pre-wrap">${text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre>`;
    };
    src.addEventListener('input', render);
    render();
}

export function downloadMarkdown() {
    const src = document.getElementById('md-src') as HTMLTextAreaElement | null;
    if (!src) return;
    const blob = new Blob([src.value || ''], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'catatan.md';
    a.click();
    URL.revokeObjectURL(a.href);
}
