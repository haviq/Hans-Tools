import { showAlert } from '../ui.js';

export function convertCase() {
    const text = (document.getElementById('case-input') as HTMLTextAreaElement | null)?.value || '';
    const mode = (document.getElementById('case-mode') as HTMLSelectElement | null)?.value || 'upper';
    const out = document.getElementById('case-output') as HTMLTextAreaElement | null;
    if (!text) { showAlert('Input Kosong', 'Masukkan teks dulu.'); return; }
    let result = text;
    switch (mode) {
        case 'upper': result = text.toUpperCase(); break;
        case 'lower': result = text.toLowerCase(); break;
        case 'title': result = titleCase(text); break;
        case 'sentence': result = sentenceCase(text); break;
        case 'camel': result = camelCase(text); break;
        case 'snake': result = snakeCase(text); break;
        case 'kebab': result = kebabCase(text); break;
    }
    if (out) out.value = result;
}

function titleCase(text: string) {
    return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function sentenceCase(text: string) {
    return text.replace(/(^|\s)(\w)/g, (_m, p1, p2) => p1 + p2.toUpperCase());
}

function camelCase(text: string) {
    const words = text.toLowerCase().split(/\W+/).filter(Boolean);
    return words.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join('');
}

function snakeCase(text: string) {
    return text.toLowerCase().split(/\W+/).filter(Boolean).join('_');
}

function kebabCase(text: string) {
    return text.toLowerCase().split(/\W+/).filter(Boolean).join('-');
}
