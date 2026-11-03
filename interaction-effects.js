(() => {
  'use strict';

  const root = document.documentElement;
  const aura = document.querySelector('#scroll-aura');
  const flashes = document.querySelector('#interaction-flashes');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const selector = 'a[href]:not(.skip-link), button:not(:disabled), summary';
  const enabled = () => !reduced.matches && root.dataset.motion !== 'paused';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const activationTimers = new WeakMap();
  let hovered = null, pressed = null, pointerFrame = 0, pointer = { x: 0, y: 0 };

  function findControl(target) {
    return target instanceof Element ? target.closest(selector) : null;
  }
  function register(control) {
    control?.classList.add('fx-control');
    return control;
  }
  function refresh() {
    document.querySelectorAll(selector).forEach(register);
    if (hovered && !hovered.isConnected) clearHover();
  }
  function clearHover() {
    hovered?.classList.remove('fx-hover');
    hovered = null;
  }
  function release() {
    pressed?.classList.remove('fx-pressed');
    pressed = null;
  }
  function paintPointer() {
    pointerFrame = 0;
    if (!hovered?.isConnected || !enabled()) return clearHover();
    const rect = hovered.getBoundingClientRect();
    hovered.style.setProperty('--fx-x', `${clamp((pointer.x - rect.left) / rect.width, 0, 1) * 100}%`);
    hovered.style.setProperty('--fx-y', `${clamp((pointer.y - rect.top) / rect.height, 0, 1) * 100}%`);
  }
  function followPointer(event) {
    if (event.pointerType === 'touch' || !finePointer.matches || !enabled()) return;
    const control = register(findControl(event.target));
    if (hovered !== control) {
      clearHover();
      hovered = control;
      hovered?.classList.add('fx-hover');
    }
    if (!hovered) return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
  }
  document.addEventListener('pointerover', followPointer, { passive: true });
  document.addEventListener('pointermove', followPointer, { passive: true });
  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) clearHover();
  }, { passive: true });
  document.addEventListener('focusin', event => register(findControl(event.target)));
  document.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !enabled()) return;
    release();
    pressed = register(findControl(event.target));
    pressed?.classList.add('fx-pressed');
  }, { capture: true, passive: true });
  document.addEventListener('pointerup', release, { capture: true, passive: true });
  document.addEventListener('pointercancel', release, { capture: true, passive: true });
  document.addEventListener('keydown', event => {
    if (!enabled() || event.repeat || !['Enter', ' '].includes(event.key)) return;
    pressed = register(findControl(event.target));
    pressed?.classList.add('fx-pressed');
  });
  document.addEventListener('keyup', release);

  // Click effects are visual only: native navigation, drag, and focus behavior stay intact.
  document.addEventListener('click', event => {
    if (!enabled()) return;
    const control = register(findControl(event.target));
    const pulse = document.createElement('span');
    pulse.setAttribute('aria-hidden', 'true');
    if (control) {
      // A dragged badge is handled by its spring, rather than a click response.
      if (control.id === 'id-card' && typeof didDrag !== 'undefined' && didDrag) return;
      const rect = control.getBoundingClientRect();
      const keyboard = event.detail === 0;
      pulse.className = 'fx-ripple';
      pulse.style.setProperty('--ripple-x', `${keyboard ? rect.width / 2 : clamp(event.clientX - rect.left, 0, rect.width)}px`);
      pulse.style.setProperty('--ripple-y', `${keyboard ? rect.height / 2 : clamp(event.clientY - rect.top, 0, rect.height)}px`);
      pulse.style.setProperty('--ripple-size', `${Math.min(560, Math.max(rect.width, rect.height) * 1.7)}px`);
      const oldPulses = control.querySelectorAll(':scope > .fx-ripple');
      if (oldPulses.length >= 3) oldPulses[0].remove();
      control.append(pulse);
      control.classList.add('fx-activated');
      clearTimeout(activationTimers.get(control));
      activationTimers.set(control, setTimeout(() => control.classList.remove('fx-activated'), 430));
    } else {
      if (!event.detail || document.querySelector('dialog[open]')) return;
      pulse.className = 'click-flare';
      pulse.style.left = `${event.clientX}px`;
      pulse.style.top = `${event.clientY}px`;
      if (flashes.childElementCount >= 4) flashes.firstElementChild.remove();
      flashes.append(pulse);
    }
    setTimeout(() => pulse.remove(), 720);
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
    clearHover();
    if (!scrollFrame) {
      lastFrame = now - 16;
      scrollFrame = requestAnimationFrame(paintScroll);
    }
  }, { passive: true });
  function resetEffects() {
    clearHover();
    release();
    cancelAnimationFrame(pointerFrame);
    cancelAnimationFrame(scrollFrame);
    pointerFrame = scrollFrame = 0;
    glow = targetGlow = 0;
    root.style.setProperty('--scroll-light', '0');
    document.querySelectorAll('.fx-ripple, .click-flare').forEach(el => el.remove());
  }
  reduced.addEventListener('change', resetEffects);
  finePointer.addEventListener('change', clearHover);
  window.addEventListener('blur', resetEffects);
  document.addEventListener('visibilitychange', () => { if (document.hidden) resetEffects(); });
  window.addEventListener('portfolio-layout', refresh);
  refresh();
})();
