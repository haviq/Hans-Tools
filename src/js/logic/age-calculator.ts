import { showAlert } from '../ui.js';

export function calculateAge() {
    const birth = (document.getElementById('age-input') as HTMLInputElement | null)?.value;
    const out = document.getElementById('age-output') as HTMLElement | null;
    if (!birth) { showAlert('Input Kosong', 'Pilih tanggal lahir.'); return; }
    const birthDate = new Date(birth);
    if (isNaN(birthDate.getTime())) { showAlert('Invalid', 'Tanggal tidak valid.'); return; }
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    if (out) out.textContent = `Umur: ${years} tahun, ${months} bulan, ${days} hari`;
}
