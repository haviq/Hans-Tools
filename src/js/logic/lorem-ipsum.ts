const LOREM = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];

export function generateLorem() {
    const type = (document.getElementById('lorem-type') as HTMLSelectElement | null)?.value || 'paras';
    const count = Math.min(parseInt((document.getElementById('lorem-count') as HTMLInputElement | null)?.value || '3', 10) || 3, 50);
    const out = document.getElementById('lorem-output') as HTMLTextAreaElement | null;
    if (!out) return;
    if (type === 'words') {
        const words = [];
        for (let i = 0; i < count; i++) words.push(LOREM[i % LOREM.length]);
        out.value = words.join(' ');
        return;
    }
    const paras = [];
    for (let p = 0; p < count; p++) {
        const len = 20 + Math.floor(Math.random() * 25);
        const words = [];
        for (let i = 0; i < len; i++) words.push(LOREM[Math.floor(Math.random() * LOREM.length)]);
        paras.push(words.join(' ') + '.');
    }
    out.value = paras.join('\n\n');
}

export function copyLorem() {
    const out = (document.getElementById('lorem-output') as HTMLTextAreaElement | null)?.value || '';
    if (out) navigator.clipboard?.writeText(out);
}

export function setupLoremIpsum() {
    document.getElementById('lorem-copy')?.addEventListener('click', copyLorem);
}
