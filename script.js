(function(){
  /* ---------- auto-incrementing years-in-business ---------- */
  var FOUNDED_YEAR = 2017;
  var years = new Date().getFullYear() - FOUNDED_YEAR;
  document.querySelectorAll('.years-count').forEach(function(el){
    el.textContent = years;
  });

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('menuToggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(function(a){
      a.addEventListener('click', function(){ nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); });
    });
  }

  /* default theme */
  if(!document.documentElement.getAttribute('data-theme')){ document.documentElement.setAttribute('data-theme','light'); }

  var themeToggle = document.getElementById('themeToggle');
  function currentTheme(){ return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function syncThemeLabel(t){ themeToggle.setAttribute('aria-label', t === 'dark' ? 'Switch to white mode' : 'Switch to dark mode'); }
  if (themeToggle) {
    syncThemeLabel(currentTheme());
    themeToggle.addEventListener('click', function(){
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try{ localStorage.setItem('fidk-theme', next); }catch(e){}
      syncThemeLabel(next);
      userToggled = true;
      hideThemePrompt();
    });
  }

  /* ---------- dark-mode nudge: after 15s, ask to switch to white or stay ---------- */
  var userToggled = false, themePrompt = null;
  function hideThemePrompt(){
    if (!themePrompt) return;
    themePrompt.classList.remove('show');
    var p = themePrompt; themePrompt = null;
    setTimeout(function(){ if (p.parentNode) p.parentNode.removeChild(p); }, 400);
  }
  function showThemePrompt(){
    if (themePrompt || userToggled || currentTheme() !== 'dark') return;
    try{ if (localStorage.getItem('fidk-dark-ok') === '1') return; }catch(e){}
    var el = document.createElement('div');
    el.className = 'theme-prompt';
    el.setAttribute('role','dialog');
    el.setAttribute('aria-label','Colour mode');
    el.innerHTML =
      '<p><strong>Prefer white mode?</strong> This site looks best in white mode, but you can stay in dark if you like it.</p>' +
      '<div class="theme-prompt-actions">' +
        '<button type="button" class="btn btn-accent" data-act="light">Switch to white mode</button>' +
        '<button type="button" class="btn btn-ghost" data-act="stay">Stay in dark mode</button>' +
      '</div>';
    document.body.appendChild(el);
    themePrompt = el;
    el.addEventListener('click', function(e){
      var b = e.target.closest('button[data-act]');
      if (!b) return;
      if (b.getAttribute('data-act') === 'light') {
        document.documentElement.setAttribute('data-theme','light');
        try{ localStorage.setItem('fidk-theme','light'); }catch(err){}
        if (themeToggle) syncThemeLabel('light');
      } else {
        try{ localStorage.setItem('fidk-dark-ok','1'); }catch(err){}
      }
      hideThemePrompt();
    });
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('show'); }); });
  }
  if (currentTheme() === 'dark') { setTimeout(showThemePrompt, 15000); }

  function buildMessage(){
    var name = document.getElementById('f-name').value.trim();
    var phone = document.getElementById('f-phone').value.trim();
    var town = document.getElementById('f-town').value.trim();
    var type = document.getElementById('f-type').value;
    var msg = document.getElementById('f-message').value.trim();
    var lines = [
      'Hi Full Interior Designs Kenya, I\'d like a quote.',
      'Name: ' + (name || '-'),
      'Phone: ' + (phone || '-'),
      'Town/area: ' + (town || '-'),
      'Project type: ' + type
    ];
    if (msg) lines.push('Details: ' + msg);
    return lines.join('\n');
  }

  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!form.reportValidity()) return;
      var text = encodeURIComponent(buildMessage());
      window.open('https://wa.me/254182662424?text=' + text, '_blank', 'noopener');
    });

    var emailBtn = document.getElementById('emailInstead');
    if (emailBtn) {
      emailBtn.addEventListener('click', function(){
        var subject = encodeURIComponent('Quote request — Full Interior Designs Kenya');
        var body = encodeURIComponent(buildMessage());
        window.location.href = 'mailto:fullinterior.ke@gmail.com?subject=' + subject + '&body=' + body;
      });
    }
  }

  var frame = document.getElementById('slideshowFrame');
  if (frame) {
    var slides = Array.prototype.slice.call(frame.querySelectorAll('.slide'));
    var dotsWrap = document.getElementById('slideDots');
    var topicChips = Array.prototype.slice.call(document.querySelectorAll('#topicRow .chip'));
    var idx = 0, timer = null;
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    slides.forEach(function(s, i){
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'sdot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Show photo ' + (i + 1));
      d.addEventListener('click', function(){ show(i); restart(); });
      dotsWrap.appendChild(d);
    });
    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.sdot'));

    function glowTopics(topicString){
      var active = (topicString || '').split(/\s+/).filter(Boolean);
      topicChips.forEach(function(chip){
        var t = chip.getAttribute('data-topic');
        chip.classList.toggle('glow', active.indexOf(t) !== -1);
      });
    }

    function show(n){
      idx = (n + slides.length) % slides.length;
      slides.forEach(function(s, i){ s.classList.toggle('active', i === idx); });
      dots.forEach(function(d, i){ d.classList.toggle('active', i === idx); });
      glowTopics(slides[idx].getAttribute('data-topics'));
    }

    function next(){ show(idx + 1); }
    function prev(){ show(idx - 1); }

    function restart(){
      if (timer) clearInterval(timer);
      if (!reduceMotion) timer = setInterval(next, 4500);
    }

    document.getElementById('slideNext').addEventListener('click', function(){ next(); restart(); });
    document.getElementById('slidePrev').addEventListener('click', function(){ prev(); restart(); });
    frame.addEventListener('mouseenter', function(){ if (timer) clearInterval(timer); });
    frame.addEventListener('mouseleave', restart);

    show(0);
    restart();
  }

  /* ---------- work-page gallery filter ---------- */
  var filterBar = document.getElementById('workFilters');
  var gallery = document.getElementById('workGallery');
  if (filterBar && gallery) {
    var filterChips = Array.prototype.slice.call(filterBar.querySelectorAll('.chip'));
    var shots = Array.prototype.slice.call(gallery.querySelectorAll('.shot'));
    filterChips.forEach(function(chip){
      chip.addEventListener('click', function(){
        filterChips.forEach(function(c){ c.classList.remove('active'); });
        chip.classList.add('active');
        var topic = chip.getAttribute('data-topic');
        shots.forEach(function(shot){
          var topics = (shot.getAttribute('data-topics') || '').split(/\s+/);
          var show = topic === 'all' || topics.indexOf(topic) !== -1;
          shot.hidden = !show;
        });
      });
    });
  }
  /* ---------- ad tracking: WhatsApp / call taps and quote form ---------- */
  function track(evt, params){
    try { if (typeof fbq === 'function') fbq('track', evt, params || {}); } catch(e){}
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me') !== -1) track('Contact', { method: 'whatsapp' });
    else if (href.indexOf('tel:') === 0) track('Contact', { method: 'call' });
  });
  var quoteFormEl = document.getElementById('quoteForm');
  if (quoteFormEl) {
    quoteFormEl.addEventListener('submit', function(){
      if (quoteFormEl.checkValidity()) track('Lead', { method: 'whatsapp_form' });
    });
  }
})();

/* ---------- image viewer: click any project photo to view it large ---------- */
(function(){
  var main = document.querySelector('main');
  if (!main) return;

  var HOST_SEL = '.shot, .card-img, .hero-photo, .slide';
  var entries = [];

  function absUrl(u){ var a = document.createElement('a'); a.href = u; return a.href; }

  main.querySelectorAll('img').forEach(function(img){
    var src = img.getAttribute('src') || '';
    var alt = (img.getAttribute('alt') || '').trim();
    if (!src || !alt) return;
    if (/(^|\/)(logo|favicon|apple-touch)/.test(src)) return;
    if (img.closest('a, button, nav, footer, .theme-prompt')) return;
    var host = img.closest(HOST_SEL) || img;
    if (host.getAttribute('data-lb-host')) return;
    host.setAttribute('data-lb-host', '1');
    host.setAttribute('tabindex', '0');
    host.setAttribute('role', 'button');
    host.setAttribute('aria-label', 'View larger: ' + alt);
    if (window.getComputedStyle(host).position === 'static') host.style.position = 'relative';
    entries.push({ host: host, img: img, src: src, alt: alt });
  });
  if (!entries.length) return;

  function captionFor(e){
    var c = e.host.querySelector('.cap, .cap-title, .t');
    if (!c) {
      var card = e.host.closest('.card');
      c = card && card.querySelector('h3');
    }
    return (c && c.textContent.trim()) || e.alt;
  }

  /* build the viewer once */
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image viewer');
  lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML =
    '<button class="lb-close" type="button" aria-label="Close image viewer">&times;</button>' +
    '<button class="lb-nav lb-prev" type="button" aria-label="Previous image"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<button class="lb-nav lb-next" type="button" aria-label="Next image"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<figure class="lb-stage"><img src="" alt=""><figcaption><span class="lb-cap"></span><span class="lb-count"></span></figcaption></figure>';
  document.body.appendChild(lb);

  var im = lb.querySelector('img');
  var cap = lb.querySelector('.lb-cap');
  var cnt = lb.querySelector('.lb-count');
  var stage = lb.querySelector('.lb-stage');
  var btnClose = lb.querySelector('.lb-close');
  var btnPrev = lb.querySelector('.lb-prev');
  var btnNext = lb.querySelector('.lb-next');
  var items = [], idx = 0, opener = null;

  /* photos currently on screen (skips ones hidden by the Our Work filter), no repeats */
  function currentItems(){
    var seen = {}, list = [];
    entries.forEach(function(e){
      if (!e.img.getClientRects().length) return;
      var k = absUrl(e.src);
      if (seen[k]) return;
      seen[k] = 1;
      list.push({ key: k, src: e.src, alt: e.alt, cap: captionFor(e) });
    });
    return list;
  }

  function preload(i){
    if (items.length < 2) return;
    var o = items[(i + items.length) % items.length];
    var x = new Image(); x.src = o.src;
  }

  function show(i, dir){
    idx = (i + items.length) % items.length;
    var o = items[idx];
    stage.classList.remove('is-in-l', 'is-in-r');
    void stage.offsetWidth;
    im.src = o.src;
    im.alt = o.alt;
    cap.textContent = o.cap;
    cnt.textContent = (idx + 1) + ' / ' + items.length;
    if (dir) stage.classList.add(dir > 0 ? 'is-in-r' : 'is-in-l');
    preload(idx + 1); preload(idx - 1);
  }

  function openFor(entry){
    items = currentItems();
    var key = absUrl(entry.src), start = 0;
    for (var n = 0; n < items.length; n++) { if (items[n].key === key) { start = n; break; } }
    var multi = items.length > 1;
    btnPrev.hidden = !multi; btnNext.hidden = !multi;
    cnt.hidden = !multi;
    opener = entry.host;
    show(start, 0);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('lb-lock');
    btnClose.focus();
  }

  function close(){
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('lb-lock');
    if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (err) {} }
  }

  function next(){ if (items.length > 1) show(idx + 1, 1); }
  function prev(){ if (items.length > 1) show(idx - 1, -1); }

  entries.forEach(function(e){
    e.host.addEventListener('click', function(){ openFor(e); });
    e.host.addEventListener('keydown', function(ev){
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); openFor(e); }
    });
  });

  btnClose.addEventListener('click', close);
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  lb.addEventListener('click', function(ev){ if (ev.target === lb || ev.target === stage) close(); });

  document.addEventListener('keydown', function(ev){
    if (!lb.classList.contains('is-open')) return;
    if (ev.key === 'Escape') close();
    else if (ev.key === 'ArrowRight') next();
    else if (ev.key === 'ArrowLeft') prev();
    else if (ev.key === 'Tab') {            /* keep keyboard focus inside the viewer */
      var f = [btnClose, btnPrev, btnNext].filter(function(b){ return !b.hidden; });
      var at = f.indexOf(document.activeElement);
      ev.preventDefault();
      f[(at + (ev.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });

  /* swipe left / right on touch screens */
  var sx = null, sy = 0;
  lb.addEventListener('pointerdown', function(ev){
    if (ev.target.closest('.lb-nav, .lb-close')) return;
    sx = ev.clientX; sy = ev.clientY;
  });
  lb.addEventListener('pointerup', function(ev){
    if (sx === null) return;
    var dx = ev.clientX - sx, dy = ev.clientY - sy; sx = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) { dx < 0 ? next() : prev(); }
  });
  lb.addEventListener('pointercancel', function(){ sx = null; });
})();
