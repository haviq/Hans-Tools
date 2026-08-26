import { showAlert } from '../ui.js';

export function startQrScanner() {
    const video = document.getElementById('qr-video') as HTMLVideoElement | null;
    const out = document.getElementById('qr-scan-result') as HTMLInputElement | null;
    if (!video) return;
    if (!('BarcodeDetector' in window)) {
        showAlert('Tidak didukung', 'Browser tidak mendukung BarcodeDetector API. Coba Chrome/Edge.');
        return;
    }
    const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            video.srcObject = stream;
            video.play();
            const scan = setInterval(async () => {
                if (video.readyState !== video.HAVE_ENOUGH_DATA) return;
                try {
                    const codes = await detector.detect(video);
                    if (codes.length > 0) {
                        clearInterval(scan);
                        stream.getTracks().forEach(t => t.stop());
                        if (out) out.value = codes[0].rawValue;
                        showAlert('QR Terdeteksi', codes[0].rawValue);
                    }
                } catch { /* ignore */ }
            }, 1000);
        })
        .catch(() => showAlert('Kamera', 'Tidak bisa mengakses kamera.'));
}

export function stopQrScanner() {
    const video = document.getElementById('qr-video') as HTMLVideoElement | null;
    if (video?.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        video.srcObject = null;
    }
}

export function setupQrScanner() {
    document.getElementById('qr-stop')?.addEventListener('click', stopQrScanner);
}
