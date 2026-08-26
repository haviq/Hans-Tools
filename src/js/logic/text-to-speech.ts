import { showAlert } from '../ui.js';

export function speakText() {
    const text = (document.getElementById('tts-input') as HTMLTextAreaElement | null)?.value || '';
    if (!text.trim()) { showAlert('Input Kosong', 'Tulis atau tempel teks dulu.'); return; }
    if (!('speechSynthesis' in window)) { showAlert('Tidak didukung', 'Browser tidak mendukung Text to Speech.'); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const rate = parseFloat((document.getElementById('tts-rate') as HTMLSelectElement | null)?.value || '1') || 1;
    utter.lang = 'id-ID';
    utter.rate = rate;
    window.speechSynthesis.speak(utter);
}

export function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

export function setupTextToSpeech() {
    document.getElementById('tts-stop')?.addEventListener('click', stopSpeech);
}
