import { showLoader, hideLoader, showAlert } from '../ui.js';
import * as pdfjsLib from 'pdfjs-dist';

export function setupPdfViewer() {
    const input = document.getElementById('pdf-viewer-input') as HTMLInputElement | null;
    const canvas = document.getElementById('pdf-viewer-canvas') as HTMLCanvasElement | null;
    const pager = document.getElementById('pdf-viewer-page') as HTMLSpanElement | null;
    if (!input || !canvas) return;
    let current = 0;
    let doc: any = null;

    input.addEventListener('change', async () => {
        const file = input.files?.[0];
        if (!file) return;
        showLoader('Memuat PDF...');
        try {
            const data = await file.arrayBuffer();
            doc = await pdfjsLib.getDocument({ data }).promise;
            current = 1;
            await renderPage();
            hideLoader();
        } catch (e) {
            hideLoader();
            showAlert('Gagal', `Tidak bisa membaca PDF: ${e}`);
        }
    });

    const renderPage = async () => {
        if (!doc || !canvas) return;
        const page = await doc.getPage(current);
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (pager) pager.textContent = `${current} / ${doc.numPages}`;
    };

    const prev = document.getElementById('pdf-viewer-prev');
    const next = document.getElementById('pdf-viewer-next');
    prev?.addEventListener('click', () => { if (doc && current > 1) { current--; renderPage(); } });
    next?.addEventListener('click', () => { if (doc && current < doc.numPages) { current++; renderPage(); } });
}
