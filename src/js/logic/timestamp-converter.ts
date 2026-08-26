import { showAlert } from '../ui.js';

export function convertTimestamp() {
    const value = (document.getElementById('ts-input') as HTMLInputElement | null)?.value || '';
    const mode = (document.getElementById('ts-mode') as HTMLSelectElement | null)?.value || 'unix';
    const out = document.getElementById('ts-output') as HTMLTextAreaElement | null;
    if (!value.trim()) { showAlert('Input Kosong', 'Masukkan timestamp atau tanggal.'); return; }
    if (!out) return;
    try {
        let date: Date;
        if (mode === 'unix') {
            const unix = parseInt(value, 10);
            if (isNaN(unix)) { showAlert('Invalid', 'Unix timestamp harus angka.'); return; }
            date = new Date(unix * 1000);
        } else {
            date = new Date(value);
            if (isNaN(date.getTime())) { showAlert('Invalid', 'Format tanggal tidak dikenal.'); return; }
        }
        const pad = (n: number) => String(n).padStart(2, '0');
        out.value = [
            `Unix: ${Math.floor(date.getTime() / 1000)}`,
            `ISO: ${date.toISOString()}`,
            `Lokal: ${date.toLocaleString('id-ID')}`,
            `Tanggal: ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`,
            `Waktu: ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`,
        ].join('\n');
    } catch (e) {
        showAlert('Gagal', String(e));
    }
}
