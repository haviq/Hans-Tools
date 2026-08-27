import { showLoader, hideLoader, showAlert } from '../ui.js';

export async function convertFile() {
    const input = document.getElementById('converter-file-input') as HTMLInputElement | null;
    if (!input?.files?.length) { showAlert('File dibutuhkan', 'Pilih file dulu.'); return; }
    const file = input.files[0];
    const win = window as any;
    showLoader('Loading FFmpeg.wasm...');
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
        ffmpeg.on('log', ({ message }: any) => console.log('[ffmpeg]', message));
        await ffmpeg.load({ coreURL: '/ffmpeg/ffmpeg-core.js', wasmURL: '/ffmpeg/ffmpeg-core.wasm' });
        const data = new Uint8Array(await file.arrayBuffer());
        await ffmpeg.writeFile(file.name, data);
        const target = (document.getElementById('converter-format') as HTMLSelectElement | null)?.value || 'mp4';
        const base = file.name.replace(/\.[^.]+$/, '');
        const args = ['-i', file.name];
        if (file.type.startsWith('image/')) {
            args.push('-vf', 'scale=iw:ih', base + '.' + target);
        } else if (file.type.startsWith('audio/')) {
            args.push('-vn', base + '.' + target);
        } else {
            args.push('-c', 'copy', base + '.' + target);
        }
        showLoader(`Konversi ke ${target}...`);
        await ffmpeg.exec(args);
        const outName = base + '.' + target;
        const outData = await ffmpeg.readFile(outName);
        const blob = new Blob([outData.buffer], { type: 'application/octet-stream' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = outName;
        a.click();
        URL.revokeObjectURL(a.href);
        hideLoader();
        showAlert('Selesai', `File ${outName} diunduh.`);
    } catch (e) {
        hideLoader();
        showAlert('Konversi Gagal', String(e));
    }
}
