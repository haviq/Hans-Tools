import { showLoader, hideLoader, showAlert } from '../ui.js';
export async function videoToGif() {
    const input = document.getElementById('v2g-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih video.'); return; }
    const file = input.files[0];
    const win = window as any;
    showLoader('Memuat FFmpeg.wasm...');
    try {
        if (!win.FFmpegWASM) {
            await new Promise<void>((resolve, reject) => {
                const s = document.createElement('script');
                s.src = '/ffmpeg/ffmpeg.js';
                s.onload = () => resolve();
                s.onerror = () => reject(new Error('Gagal memuat FFmpeg'));
                document.head.appendChild(s);
            });
        }
        const { FFmpeg } = win.FFmpegWASM;
        const ffmpeg = new FFmpeg();
        await ffmpeg.load({ coreURL: '/ffmpeg/ffmpeg-core.js', wasmURL: '/ffmpeg/ffmpeg-core.wasm' });
        await ffmpeg.writeFile(file.name, new Uint8Array(await file.arrayBuffer()));
        const outName = file.name.split('.').slice(0, -1).join('.') + '.gif';
        await ffmpeg.exec(['-i', file.name, '-vf', 'fps=10,scale=480:-1', '-loop', '0', outName]);
        const data = await ffmpeg.readFile(outName);
        const blob = new Blob([(data as any).buffer], { type: 'image/gif' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = outName; a.click();
        URL.revokeObjectURL(a.href);
        hideLoader(); showAlert('Selesai', 'GIF berhasil dibuat.');
    } catch (e) { hideLoader(); showAlert('Gagal', String(e)); }
}
