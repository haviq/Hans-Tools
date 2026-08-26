import { showAlert } from '../ui.js';

export function decodeJwt() {
    const token = (document.getElementById('jwt-input') as HTMLInputElement | null)?.value?.trim();
    const out = document.getElementById('jwt-output') as HTMLTextAreaElement | null;
    if (!token) { showAlert('Input Kosong', 'Tempel token JWT.'); return; }
    const parts = token.split('.');
    if (parts.length < 2) { showAlert('Invalid', 'Format JWT tidak valid.'); return; }
    const b64u = (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
    try {
        const header = JSON.parse(b64u(parts[0]));
        const payload = JSON.parse(b64u(parts[1]));
        if (out) out.value = "HEADER\n" + JSON.stringify(header, null, 2) + "\n\nPAYLOAD\n" + JSON.stringify(payload, null, 2);
    } catch { showAlert('Invalid', 'Tidak bisa decode JWT.'); }
}
