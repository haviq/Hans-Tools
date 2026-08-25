import { showLoader, hideLoader, showAlert } from '../ui.js';

export async function ocr() {
    const fileInput = document.getElementById('ocr-file-input') as HTMLInputElement | null;
    const lang = (document.getElementById('ocr-lang') as HTMLSelectElement | null)?.value || 'eng';
    const out = document.getElementById('ocr-result') as HTMLTextAreaElement | null;
    if (!fileInput?.files?.length) { showAlert('File dibutuhkan', 'Pilih gambar dulu.'); return; }
    const file = fileInput.files[0];
    showLoader('Loading Tesseract OCR...');
    try {
        const win = window as any;
        if (!win.Tesseract) {
            await new Promise<void>((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
                s.onload = () => resolve();
                s.onerror = () => reject(new Error('Gagal memuat Tesseract'));
                document.head.appendChild(s);
            });
        }
        showLoader('OCR sedang berjalan...');
        const result = await win.Tesseract.recognize(file, lang, { logger: (m: any) => { if (out) out.value = `Progress: ${Math.round((m.progress||0)*100)}%`; } });
        if (out) out.value = result.data.text;
        hideLoader();
        showAlert('Selesai', 'OCR selesai. Teks bisa disalin dari textarea.');
    } catch (e) {
        hideLoader();
        showAlert('OCR Gagal', String(e));
    }
}
