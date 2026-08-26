import { showAlert } from '../ui.js';

export function checkPasswordStrength() {
    const pass = (document.getElementById('ps-input') as HTMLInputElement | null)?.value || '';
    const out = document.getElementById('ps-output') as HTMLElement | null;
    if (!pass) { showAlert('Input Kosong', 'Masukkan password.'); return; }
    let score = 0;
    const checks: string[] = [];
    if (pass.length >= 8) { score += 1; checks.push('✅ Panjang >= 8'); } else { checks.push('❌ Panjang minimal 8'); }
    if (pass.length >= 12) { score += 1; checks.push('✅ Panjang >= 12'); }
    if (/[a-z]/.test(pass)) { score += 1; checks.push('✅ Huruf kecil'); } else { checks.push('❌ Tidak ada huruf kecil'); }
    if (/[A-Z]/.test(pass)) { score += 1; checks.push('✅ Huruf besar'); } else { checks.push('❌ Tidak ada huruf besar'); }
    if (/[0-9]/.test(pass)) { score += 1; checks.push('✅ Angka'); } else { checks.push('❌ Tidak ada angka'); }
    if (/[^a-zA-Z0-9]/.test(pass)) { score += 1; checks.push('✅ Simbol'); } else { checks.push('❌ Tidak ada simbol'); }
    const level = score <= 2 ? 'Lemah' : score <= 4 ? 'Sedang' : 'Kuat';
    const colors: Record<string, string> = { Lemah: 'text-red-400', Sedang: 'text-yellow-400', Kuat: 'text-green-400' };
    if (out) out.innerHTML = `<div class="text-lg font-bold ${colors[level]}">${level} (${score}/6)</div>` + checks.join('<br>');
}
