import { showAlert } from '../ui.js';

export function countWords() {
    const text = (document.getElementById('word-input') as HTMLTextAreaElement | null)?.value || '';
    const out = document.getElementById('word-output') as HTMLElement | null;
    if (!text.trim()) { if (out) out.textContent = 'Ketik teks untuk menghitung.'; return; }
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s+/g, '').length;
    const lines = text.split(/\n/).filter(l => l.trim()).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    if (out) out.textContent = `Kata: ${words} | Karakter: ${chars} | Karakter (tanpa spasi): ${charsNoSpace} | Baris: ${lines} | Kalimat: ${sentences}`;
}
