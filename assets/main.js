/* ── nav scroll state ── */
var siteNav = document.getElementById('site-nav');
if (siteNav) {
  window.addEventListener('scroll', function(){
    siteNav.classList.toggle('scrolled', scrollY > 60);
  });
}

/* ── mobile nav toggle ── */
var navToggle = document.getElementById('nav-toggle');
var navMobile = document.getElementById('nav-mobile');
if (navToggle && navMobile) {
  navToggle.addEventListener('click', function() {
    navToggle.classList.toggle('is-open');
    navMobile.classList.toggle('is-open');
  });
  navMobile.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      navToggle.classList.remove('is-open');
      navMobile.classList.remove('is-open');
    });
  });
}

/* ── before/after slider ── */
var revealWrap   = document.getElementById('reveal');
var revealSlider = document.getElementById('reveal-slider');
if (revealWrap && revealSlider) {
  revealSlider.addEventListener('input', function() {
    revealWrap.style.setProperty('--reveal', this.value + '%');
  });
}

/* ── intersection reveal ── */
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: .11 });
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
