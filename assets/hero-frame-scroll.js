/**
 * hero-frame-scroll.js
 * Reusable canvas frame-sequence hero with GSAP ScrollTrigger scrubbing.
 * Requires: GSAP + ScrollTrigger loaded and registered before calling initFrameScrollHero().
 */
function initFrameScrollHero(options) {
  var cfg = Object.assign({
    frameCount        : 0,
    framePath         : function(i) { return 'frames/frame_' + String(i).padStart(4, '0') + '.jpg'; },
    wrapperSelector   : '#hero-wrapper',
    canvasId          : 'hero-canvas',
    overlaySelector   : '.hero-overlay',
    contentSelector   : '.hero-content',
    indicatorSelector : '.scroll-indicator',
    heroSelector      : '#hero',
    scrollMultiplier  : 3,
    animCompletesAt   : 0.67,
    indicatorFadeEnd  : 0.12,
    overlayStart      : 0.70,
    overlayMaxAlpha   : 0.62,
    contentStart      : 0.82,
    contentRise       : 18,
    fit               : 'cover',
    fallbackBackground: 'linear-gradient(160deg,#0c1810 0%,#1c3322 50%,#2c4a30 100%)',
  }, options);

  var canvas  = document.getElementById(cfg.canvasId);
  var ctx     = canvas.getContext('2d');
  var overlay = document.querySelector(cfg.overlaySelector);
  var content = document.querySelector(cfg.contentSelector);
  var indic   = document.querySelector(cfg.indicatorSelector);
  var heroEl  = document.querySelector(cfg.heroSelector);

  var currentFrame = 0;
  var rafPending   = false;
  var frames       = [];

  function resizeCanvas() {
    canvas.width        = window.innerWidth  * devicePixelRatio;
    canvas.height       = window.innerHeight * devicePixelRatio;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);
    drawFrame(currentFrame);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function drawFrame(index) {
    var img = frames[index];
    if (!img || !img.complete) return;
    var w     = window.innerWidth;
    var h     = window.innerHeight;
    var scale = cfg.fit === 'contain'
      ? Math.min(w / img.naturalWidth, h / img.naturalHeight)
      : Math.max(w / img.naturalWidth, h / img.naturalHeight);
    var sw = img.naturalWidth  * scale;
    var sh = img.naturalHeight * scale;
    var sx = (w - sw) / 2;
    var sy = (h - sh) / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, sx, sy, sw, sh);
  }

  function renderFrame(index) {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function() {
      drawFrame(index);
      rafPending = false;
    });
  }

  for (var i = 1; i <= cfg.frameCount; i++) {
    (function(frameIndex) {
      var img = new Image();
      img.src = cfg.framePath(frameIndex);
      img.onload = function() {
        if (frameIndex === 1) drawFrame(0);
      };
      img.onerror = function() {
        if (frameIndex === 1 && heroEl) {
          heroEl.style.background = cfg.fallbackBackground;
        }
      };
      frames[frameIndex - 1] = img;
    })(i);
  }

  ScrollTrigger.create({
    trigger   : cfg.wrapperSelector,
    start     : 'top top',
    end       : '+=' + (window.innerHeight * cfg.scrollMultiplier),
    pin       : true,
    pinSpacing: true,
    scrub     : true,
    onUpdate  : function(self) {
      var p = Math.min(self.progress / cfg.animCompletesAt, 1);

      var idx = Math.min(cfg.frameCount - 1, Math.floor(p * cfg.frameCount));
      if (idx !== currentFrame) {
        currentFrame = idx;
        renderFrame(idx);
      }

      if (indic) {
        indic.style.opacity = Math.max(0, 1 - p / cfg.indicatorFadeEnd);
      }

      if (overlay) {
        var ot    = Math.max(0, Math.min(1, (p - cfg.overlayStart) / (1 - cfg.overlayStart)));
        var alpha = ot * cfg.overlayMaxAlpha;
        overlay.style.background = 'rgba(8,16,11,' + alpha.toFixed(3) + ')';
      }

      if (content) {
        var ct = Math.max(0, Math.min(1, (p - cfg.contentStart) / (1 - cfg.contentStart)));
        content.style.opacity   = ct;
        content.style.transform = 'translateY(' + ((1 - ct) * cfg.contentRise) + 'px)';
        if (ct > 0.08) content.classList.add('is-visible');
        else           content.classList.remove('is-visible');
      }
    }
  });
}
