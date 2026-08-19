/* site.js — word-splitting + scroll-reveal for every page except the home
   cinematic (which drives its own reveals off scroll-scrub in scrub-engine.js).
   Splits any [data-words] element into per-word spans (same --wi stagger
   trick as titleWords() in scrub-engine.js), then reveals .reveal blocks once
   each scrolls into view. Reduced-motion: everything just shows, no animation. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-words]').forEach(function (el) {
    var text = el.textContent;
    el.textContent = '';
    text.split(' ').forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'word';
      span.style.setProperty('--wi', i);
      span.textContent = w;
      el.appendChild(span);
      el.appendChild(document.createTextNode(' '));
    });
  });

  if (reduce || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
})();
