import { showAlert } from '../ui.js';
let screenRecorder: any = null;
export function startScreenRecorder() {
    const btn = document.getElementById('sr-btn') as HTMLButtonElement | null;
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then(stream => {
        screenRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];
        screenRecorder.ondataavailable = (e: BlobEvent) => chunks.push(e.data);
        screenRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob); a.download = 'rekaman-layar.webm'; a.click();
            stream.getTracks().forEach(t => t.stop());
        };
        screenRecorder.start();
        if (btn) btn.textContent = 'Stop';
    }).catch(() => showAlert('Layar', 'Tidak bisa merekam layar.'));
}
export function stopScreenRecorder() {
    if (screenRecorder && screenRecorder.state === 'recording') screenRecorder.stop();
    const btn = document.getElementById('sr-btn') as HTMLButtonElement | null;
    if (btn) btn.textContent = 'Mulai Rekam Layar';
}
export function setupScreenRecorder() {
    const btn = document.getElementById('sr-btn');
    btn?.addEventListener('click', () => {
        if (btn.textContent === 'Stop') stopScreenRecorder(); else startScreenRecorder();
    });
}
