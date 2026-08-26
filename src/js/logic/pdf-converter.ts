import { showLoader, hideLoader, showAlert } from '../ui.js';
import { PDFDocument, degrees } from 'pdf-lib';

export async function pdfConverter() {
    const input = document.getElementById('pdfc-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih PDF dulu.'); return; }
    const file = input.files[0];
    const action = (document.getElementById('pdfc-action') as HTMLSelectElement | null)?.value || 'compress';
    showLoader('Memproses PDF...');
    try {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        if (pdf.isEncrypted) throw new Error('PDF terenkripsi');
        let outBytes: Uint8Array;
        if (action === 'compress') {
            // Re-save akan menormalkan struktur; untuk kompresi nyata bisa pakai filter object stream
            const opts: any = { useObjectStreams: true };
            outBytes = await pdf.save(opts);
        } else if (action === 'rotate') {
            const pages = pdf.getPages();
            for (const p of pages) p.setRotation(degrees((p.getRotation().angle + 90) % 360));
            outBytes = await pdf.save();
        } else {
            outBytes = await pdf.save();
        }
        const buffer = outBytes.buffer.slice(outBytes.byteOffset, outBytes.byteOffset + outBytes.byteLength) as ArrayBuffer;
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = file.name.replace(/\.pdf$/i, '') + '-' + action + '.pdf';
        a.click();
        URL.revokeObjectURL(a.href);
        hideLoader(); showAlert('Selesai', 'PDF berhasil diproses.');
    } catch (e) {
        hideLoader(); showAlert('Gagal', String(e));
    }
}
