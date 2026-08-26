import { showLoader, hideLoader, showAlert } from '../ui.js';

export async function convertHeic() {
    const input = document.getElementById('heic-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih file HEIC dulu.'); return; }
    const file = input.files[0];
    const fmt = (document.getElementById('heic-format') as HTMLSelectElement | null)?.value || 'image/jpeg';
    const win = window as any;
    showLoader('Memuat konverter HEIC...');
    try {
        if (!win.heic2any) {
            await new Promise<void>((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';
                s.onload = () => resolve();
                s.onerror = () => reject(new Error('Gagal memuat heic2any'));
                document.head.appendChild(s);
            });
        }
        showLoader('Konversi HEIC...');
        const result = await win.heic2any({ blob: file, toType: fmt, quality: 0.9 });
        const blob: Blob = Array.isArray(result) ? result[0] : result;
        const ext = fmt === 'image/png' ? 'png' : 'jpg';
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = file.name.replace(/\.[^.]+$/, '') + '.' + ext;
        a.click();
        URL.revokeObjectURL(a.href);
        hideLoader(); showAlert('Selesai', 'HEIC berhasil dikonversi.');
    } catch (e) {
        hideLoader(); showAlert('Gagal', String(e));
    }
}
