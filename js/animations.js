// animations.js
// Scroll-driven animations: reveal-on-scroll (IntersectionObserver) and the
// subtle parallax on the hero portrait. Both are self-contained IIFEs so
// this file has no exports and no dependency on the other scripts.

(function revealOnScroll(){
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();

(function portraitParallax(){
  const portrait = document.getElementById('portrait');
  if (!portrait) return;

  let raf = 0;
  function onScroll(){
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const y = window.scrollY;
      portrait.style.transform = `translate3d(0, ${y * -0.08}px, 0)`;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();
