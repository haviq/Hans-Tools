import { showLoader, hideLoader, showAlert } from '../ui.js';

export function imageToBase64() {
    const input = document.getElementById('imgb64-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih gambar dulu.'); return; }
    const file = input.files[0];
    showLoader('Membaca gambar...');
    const reader = new FileReader();
    reader.onload = () => {
        const out = document.getElementById('imgb64-output') as HTMLTextAreaElement | null;
        if (out) out.value = String(reader.result);
        hideLoader();
    };
    reader.onerror = () => { hideLoader(); showAlert('Gagal', 'Tidak bisa membaca file.'); };
    reader.readAsDataURL(file);
}
