export function generateUuid() {
    const n = parseInt((document.getElementById('uuid-count') as HTMLInputElement | null)?.value || '5', 10) || 5;
    const out = document.getElementById('uuid-output') as HTMLTextAreaElement | null;
    if (!out) return;
    if (!crypto?.randomUUID) { out.value = 'Browser tidak mendukung UUID v4.'; return; }
    const lines: string[] = [];
    for (let i = 0; i < n; i++) lines.push(crypto.randomUUID());
    out.value = lines.join('\n');
}
