/**
 * Random Letter Swap Effect — Vanilla JS
 * Efek: huruf di kata "Hans Tools" berputar acak sebelum stabil
 */

export function initRandomLetterSwap(selector = '.rls-title') {
  const el = document.querySelector(selector);
  if (!el) return;

  const original = el.textContent;
  const letters = original.split('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

  let frame = 0;
  const totalFrames = 40; // ~2 detik @ 20fps
  const interval = 50; // ms

  function shuffle() {
    frame++;
    const progress = frame / totalFrames;
    const settled = Math.floor(letters.length * (1 - Math.pow(1 - progress, 3)));

    const result = letters.map((l, i) => {
      if (l === ' ') return ' ';
      if (i < settled) return l;
      return chars[Math.floor(Math.random() * chars.length)];
    });

    el.textContent = result.join('');

    if (frame < totalFrames) {
      setTimeout(shuffle, interval);
    } else {
      el.textContent = original;
    }
  }

  // Trigger on intersection
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && frame === 0) {
          shuffle();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  } else {
    // fallback
    setTimeout(shuffle, 500);
  }
}
