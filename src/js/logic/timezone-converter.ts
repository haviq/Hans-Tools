import { showAlert } from '../ui.js';

export function convertTimezone() {
    const value = (document.getElementById('tz-input') as HTMLInputElement | null)?.value;
    const from = (document.getElementById('tz-from') as HTMLSelectElement | null)?.value || 'UTC';
    const to = (document.getElementById('tz-to') as HTMLSelectElement | null)?.value || 'Asia/Jakarta';
    const out = document.getElementById('tz-output') as HTMLTextAreaElement | null;
    if (!value) { showAlert('Input Kosong', 'Masukkan tanggal/waktu.'); return; }
    const date = new Date(value.includes('T') ? value : value + 'T00:00:00');
    if (isNaN(date.getTime())) { showAlert('Invalid', 'Format tidak dikenal.'); return; }
    try {
        const fmt = (tz: string) => new Intl.DateTimeFormat('id-ID', { timeZone: tz, dateStyle: 'full', timeStyle: 'long' }).format(date);
        if (out) out.value = `Dari (${from}): ${fmt(from)}\nKe (${to}): ${fmt(to)}\nUTC: ${fmt('UTC')}`;
    } catch { showAlert('Invalid', 'Zona waktu tidak valid.'); }
}
