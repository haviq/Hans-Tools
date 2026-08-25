import { showAlert } from '../ui.js';

export function generatePassword() {
    const length = parseInt((document.getElementById('pw-length') as HTMLInputElement | null)?.value || '16', 10) || 16;
    const upper = (document.getElementById('pw-upper') as HTMLInputElement | null)?.checked ?? true;
    const lower = (document.getElementById('pw-lower') as HTMLInputElement | null)?.checked ?? true;
    const digits = (document.getElementById('pw-digits') as HTMLInputElement | null)?.checked ?? true;
    const symbols = (document.getElementById('pw-symbols') as HTMLInputElement | null)?.checked ?? false;
    const chars = (upper ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '') + (lower ? 'abcdefghijklmnopqrstuvwxyz' : '') + (digits ? '0123456789' : '') + (symbols ? '!@#$%^&*()-_=+[]{};:,.<>?' : '');
    if (!chars) { showAlert('Opsi Kosong', 'Pilih minimal satu karakter.'); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let out = '';
    for (let i = 0; i < length; i++) out += chars[arr[i] % chars.length];
    const target = document.getElementById('pw-output') as HTMLInputElement | null;
    if (target) target.value = out;
}
