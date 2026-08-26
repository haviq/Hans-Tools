import { showLoader, hideLoader, showAlert } from '../ui.js';

let chart: any = null;

export async function buildChart() {
    const labelsRaw = (document.getElementById('chart-labels') as HTMLTextAreaElement | null)?.value || '';
    const valuesRaw = (document.getElementById('chart-values') as HTMLTextAreaElement | null)?.value || '';
    const type = (document.getElementById('chart-type') as HTMLSelectElement | null)?.value || 'bar';
    const labels = labelsRaw.split(',').map(s => s.trim()).filter(Boolean);
    const values = valuesRaw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (!labels.length || !values.length) { showAlert('Input salah', 'Isi label dan nilai, pisahkan dengan koma.'); return; }
    const win = window as any;
    showLoader('Membuat chart...');
    try {
        if (!win.Chart) {
            await new Promise<void>((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
                s.onload = () => resolve();
                s.onerror = () => reject(new Error('Gagal memuat Chart.js'));
                document.head.appendChild(s);
            });
        }
        const canvas = document.getElementById('chart-canvas') as HTMLCanvasElement | null;
        if (!canvas) { hideLoader(); return; }
        if (chart) chart.destroy();
        chart = new win.Chart(canvas, {
            type,
            data: { labels, datasets: [{ label: 'Data', data: values, backgroundColor: 'rgba(56,189,248,0.6)', borderColor: '#38bdf8', borderWidth: 2 }] },
            options: { responsive: true, plugins: { legend: { labels: { color: '#cbd5e1' } } } }
        });
        hideLoader();
    } catch (e) {
        hideLoader(); showAlert('Gagal', String(e));
    }
}

export function exportChart() {
    const canvas = document.getElementById('chart-canvas') as HTMLCanvasElement | null;
    if (!canvas) { showAlert('Chart kosong', 'Buat chart dulu.'); return; }
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'chart.png';
    a.click();
}

export function setupChartMaker() {
    document.getElementById('chart-export')?.addEventListener('click', exportChart);
}
