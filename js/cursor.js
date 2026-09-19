// cursor.js
// Custom cursor: two circles, one filled. Only runs on devices that report
// a fine pointer with real hover support (matchMedia check below) — on
// touch/coarse-pointer devices this file does nothing at all, so the native
// cursor and touch behavior are left completely untouched.

(function customCursor(){
  const supportsCustomCursor = window.matchMedia
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!supportsCustomCursor) return;

  const cursor = document.querySelector('.custom-cursor');
  const ring = cursor && cursor.querySelector('.custom-cursor__ring');
  const dot = cursor && cursor.querySelector('.custom-cursor__dot');
  if (!cursor || !ring || !dot) return;

  document.documentElement.classList.add('has-custom-cursor');

  const reduceMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LERP = reduceMotion ? 1 : 0.18; // 1 = snap instantly, no trailing lag

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let hasMoved = false;

  function onMouseMove(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    if (!hasMoved){
      hasMoved = true;
      ringX = mouseX; ringY = mouseY;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      cursor.classList.add('is-visible');
    }
  }
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  function tick(){
    ringX += (mouseX - ringX) * LERP;
    ringY += (mouseY - ringY) * LERP;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // hide cursor when the pointer leaves the viewport, restore on re-entry
  document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
  document.addEventListener('mouseenter', () => { if (hasMoved) cursor.classList.add('is-visible'); });

  // subtle "active" state over clickable elements
  const INTERACTIVE = 'a, button, .work-row, .card, .thumb, input, textarea, select, [role="button"]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest && e.target.closest(INTERACTIVE)) cursor.classList.add('is-active');
  }, true);
  document.addEventListener('mouseout', (e) => {
    if (!e.target.closest || !e.target.closest(INTERACTIVE)) return;
    const related = e.relatedTarget;
    if (!related || !related.closest || !related.closest(INTERACTIVE)){
      cursor.classList.remove('is-active');
    }
  }, true);
})();
