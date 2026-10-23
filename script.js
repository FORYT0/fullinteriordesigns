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
})();
