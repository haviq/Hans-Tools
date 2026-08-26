import { showAlert } from '../ui.js';
let mediaRecorder: any = null;
let chunks: Blob[] = [];
export function startAudioRecorder() {
    const btn = document.getElementById('ar-btn') as HTMLButtonElement | null;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        chunks = [];
        mediaRecorder.ondataavailable = (e: BlobEvent) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob); a.download = 'rekaman.webm'; a.click();
            stream.getTracks().forEach(t => t.stop());
        };
        mediaRecorder.start();
        if (btn) btn.textContent = 'Stop';
    }).catch(() => showAlert('Mikrofon', 'Tidak bisa mengakses mikrofon.'));
}
export function stopAudioRecorder() {
    if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
    const btn = document.getElementById('ar-btn') as HTMLButtonElement | null;
    if (btn) btn.textContent = 'Mulai Rekam';
}
export function setupAudioRecorder() {
    const btn = document.getElementById('ar-btn');
    btn?.addEventListener('click', () => {
        if (btn.textContent === 'Stop') stopAudioRecorder(); else startAudioRecorder();
    });
}
