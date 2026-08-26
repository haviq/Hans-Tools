let timerInterval: any = null;
let timerMs = 0;

export function startStopTimer() {
    const btn = document.getElementById('timer-btn') as HTMLButtonElement | null;
    const display = document.getElementById('timer-display') as HTMLElement | null;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        if (btn) btn.textContent = 'Lanjut';
        return;
    }
    const step = () => {
        timerMs += 10;
        if (display) display.textContent = formatMs(timerMs);
    };
    timerInterval = setInterval(step, 10);
    if (btn) btn.textContent = 'Pause';
}

export function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerMs = 0;
    const display = document.getElementById('timer-display') as HTMLElement | null;
    const btn = document.getElementById('timer-btn') as HTMLButtonElement | null;
    if (display) display.textContent = '00:00:00';
    if (btn) btn.textContent = 'Mulai';
}

function formatMs(ms: number) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(cs).padStart(2, '0')}`;
}

export function setupTimerStopwatch() {
    document.getElementById('timer-btn')?.addEventListener('click', startStopTimer);
    document.getElementById('timer-reset')?.addEventListener('click', resetTimer);
}
