(() => {
  'use strict';

  const root = document.documentElement;
  const aura = document.querySelector('#scroll-aura');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const selector = 'a[href]:not(.skip-link), button:not(:disabled), summary, .featured-project';
  const enabled = () => !reduced.matches && root.dataset.motion !== 'paused';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const tapTimers = new WeakMap();
  let pressed = null;

  function findControl(target) {
    return target instanceof Element ? target.closest(selector) : null;
  }
  function register(control) {
    control?.classList.add('fx-control');
    return control;
  }
  function refresh() { document.querySelectorAll(selector).forEach(register); }
  function release() {
    pressed?.classList.remove('fx-pressed');
    pressed = null;
  }
  // Only native controls get the small press response. Hover styling is CSS-only.
  document.addEventListener('pointerover', event => register(findControl(event.target)), { passive: true });
  document.addEventListener('focusin', event => register(findControl(event.target)));
  document.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !enabled()) return;
    release();
    pressed = register(findControl(event.target));
    pressed?.classList.remove('fx-tapped');
    pressed?.classList.add('fx-pressed');
  }, { capture: true, passive: true });
  document.addEventListener('pointerup', release, { capture: true, passive: true });
  document.addEventListener('pointercancel', release, { capture: true, passive: true });
  document.addEventListener('keydown', event => {
    if (!enabled() || event.repeat || !['Enter', ' '].includes(event.key)) return;
    release();
    pressed = register(findControl(event.target));
    pressed?.classList.remove('fx-tapped');
    pressed?.classList.add('fx-pressed');
  });
  document.addEventListener('keyup', release);
  document.addEventListener('click', event => {
    if (!enabled()) return;
    const control = register(findControl(event.target));
    if (!control || control.matches('.id-card, .featured-project, .photo-open')) return;
    control.classList.add('fx-tapped');
    clearTimeout(tapTimers.get(control));
    tapTimers.set(control, setTimeout(() => control.classList.remove('fx-tapped'), 220));
  }, { capture: true });

  let scrollFrame = 0, glow = 0, targetGlow = 0;
  let lastScroll = scrollY, lastActivity = 0, lastSample = performance.now(), lastFrame = lastSample;
  function paintScroll(now) {
    scrollFrame = 0;
    const dt = Math.min(64, now - lastFrame);
    lastFrame = now;
    const target = enabled() && now - lastActivity < 100 ? targetGlow : 0;
    glow += (target - glow) * (1 - Math.exp(-dt / 95));
    if (glow < .003 && target === 0) glow = 0;
    root.style.setProperty('--scroll-light', glow.toFixed(3));
    if (glow || target) scrollFrame = requestAnimationFrame(paintScroll);
  }
  window.addEventListener('scroll', () => {
    const now = performance.now(), delta = Math.abs(scrollY - lastScroll);
    lastScroll = scrollY;
    if (!delta || !enabled()) return;
    targetGlow = clamp(.24 + delta / Math.max(16, now - lastSample) * .28, 0, 1);
    lastSample = lastActivity = now;
    const range = Math.max(1, root.scrollHeight - innerHeight);
    aura.style.setProperty('--scroll-drift', `${clamp(scrollY / range, 0, 1) * 14 - 7}vh`);
    if (!scrollFrame) {
      lastFrame = now - 16;
      scrollFrame = requestAnimationFrame(paintScroll);
    }
  }, { passive: true });
  function resetEffects() {
    release();
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    glow = targetGlow = 0;
    root.style.setProperty('--scroll-light', '0');
    document.querySelectorAll('.fx-tapped').forEach(el => el.classList.remove('fx-tapped'));
  }
  reduced.addEventListener('change', resetEffects);
  window.addEventListener('blur', resetEffects);
  document.addEventListener('visibilitychange', () => { if (document.hidden) resetEffects(); });
  window.addEventListener('portfolio-layout', refresh);
  refresh();
})();
