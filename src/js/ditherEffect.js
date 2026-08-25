/**
 * Dither Effect 2 - hand-written ordered dither with animated swirl.
 * Two-tone ordered dithering rendered to canvas, inspired by
 * https://www.originkit.dev/components/dither-effect-2
 * Renders at 1/4 resolution (one pixel per 4x4 dither block) and uses
 * pixelated upscaling so it stays light on mobile/desktop.
 */

export function initDitherEffect(target = '#dither-canvas') {
  const container = document.querySelector(target);
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = [
    'position:fixed',
    'inset:0',
    'width:100%',
    'height:100%',
    'pointer-events:none',
    'z-index:0',
    'opacity:0.32',
    'mix-blend-mode:overlay',
    'image-rendering:pixelated',
  ].join(';');
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 4x4 Bayer threshold matrix (ordered dithering)
  const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];

  // Two tone colors
  const C1 = [23, 37, 84];    // dark slate blue
  const C2 = [56, 189, 248];  // sky blue

  let w = 0;
  let h = 0;
  let raf = 0;

  const resize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.ceil(w / 4);
    canvas.height = Math.ceil(h / 4);
  };
  resize();
  window.addEventListener('resize', resize);

  const draw = (t) => {
    const iw = canvas.width;
    const ih = canvas.height;
    const img = ctx.createImageData(iw, ih);
    const data = img.data;

    const cx = w / 2;
    const cy = h / 2;
    const speed = t * 0.00012;

    for (let iy = 0; iy < ih; iy++) {
      for (let ix = 0; ix < iw; ix++) {
        // map block back to screen coordinates for the swirl field
        const sx = ix * 4 + 2;
        const sy = iy * 4 + 2;
        const dx = sx - cx;
        const dy = sy - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ang = Math.atan2(dy, dx) + speed + dist * 0.004;
        const v = 0.5 + 0.5 * Math.sin(ang + speed);

        const th = BAYER[iy % 4][ix % 4] / 16;
        const color = v > th ? C2 : C1;

        const i = (iy * iw + ix) * 4;
        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = 235;
      }
    }

    ctx.putImageData(img, 0, 0);
    raf = requestAnimationFrame(draw);
  };

  raf = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  };
}
