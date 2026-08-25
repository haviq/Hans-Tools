/**
 * 3D scroll interaction — Vanilla JS
 * Elemen dengan [data-3d] berotasi mengikuti scroll + parallax halus.
 */

export function initScroll3D(root = document) {
  const items = root.querySelectorAll('[data-3d]');
  if (!items.length) return;

  let ticking = false;

  const update = () => {
    const vh = window.innerHeight;
    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const progress = (center - vh / 2) / (vh / 2); // -1..1
      const clamp = Math.max(-1, Math.min(1, progress));
      const rotateY = clamp * 18;
      const rotateX = -clamp * 8;
      const translateZ = Math.abs(clamp) * -60;
      el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
      el.style.opacity = String(Math.max(0.35, 1 - Math.abs(clamp) * 0.45));
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
}
