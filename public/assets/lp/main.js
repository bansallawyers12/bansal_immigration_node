(function () {
  // Mobile nav
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // Course tabs
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = document.getElementById('tab-' + target);
      if (panel) { panel.classList.add('active'); }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.qa button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var qa = btn.closest('.qa');
      var ans = qa.querySelector('.ans');
      var isOpen = qa.classList.contains('open');
      document.querySelectorAll('.qa').forEach(function (item) {
        item.classList.remove('open');
        item.querySelector('.ans').style.maxHeight = null;
      });
      if (!isOpen) {
        qa.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  // Reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = 'none'; io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    el.style.opacity = 0;
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    io.observe(el);
  });
})();
