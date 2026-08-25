/**
 * Dither Effect 2 — Vanilla CSS/SVG
 * Efek: noise pattern overlay dengan animasi subtle
 */

export function initDitherEffect(selector = '#dither-canvas') {
  const container = document.querySelector(selector);
  if (!container) return;

  // Buat SVG filter dither
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'fixed inset-0 w-full h-full pointer-events-none z-0 opacity-[0.03]');
  svg.setAttribute('style', 'mix-blend-mode: overlay;');
  svg.innerHTML = `
    <filter id="dither-noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves="4"
        stitchTiles="stitch"
      >
        <animate
          attributeName="baseFrequency"
          values="0.9;1.1;0.9"
          dur="4s"
          repeatCount="indefinite"
        />
      </feTurbulence>
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#dither-noise)" opacity="0.4" />
  `;

  container.appendChild(svg);
}
