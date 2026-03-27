/* LEA Landing — script.js */
(function () {
  'use strict';

  /* ---- Header scroll state ---- */
  var header = document.getElementById('header');
  var scrollThreshold = 40;

  function updateHeader() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ---- Mobile menu ---- */
  var menuBtn = document.querySelector('.mobile-menu-btn');
  var mobileNav = document.getElementById('mobileNav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ---- Scroll animations (IntersectionObserver) ---- */
  var animatedEls = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animatedEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    animatedEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header.offsetHeight;
        var targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ---- Rotating hero word ---- */
  var rotatingWordEl = document.getElementById('rotatingWord');
  if (rotatingWordEl) {
    var eventTypes = [
      'мероприятий', 'конференций', 'форумов', 'выставок', 'митапов',
      'корпоративов', 'тренингов', 'воркшопов', 'фестивалей', 'семинаров',
      'хакатонов', 'саммитов', 'симпозиумов', 'мастер-классов', 'презентаций',
      'церемоний', 'тимбилдингов', 'ретритов'
    ];
    var wordIndex = 0;

    setInterval(function () {
      rotatingWordEl.classList.add('fade-out');
      setTimeout(function () {
        wordIndex = (wordIndex + 1) % eventTypes.length;
        rotatingWordEl.textContent = eventTypes[wordIndex];
        rotatingWordEl.classList.remove('fade-out');
        rotatingWordEl.classList.add('fade-in');
        // Force reflow then remove fade-in to trigger transition
        void rotatingWordEl.offsetWidth;
        rotatingWordEl.classList.remove('fade-in');
      }, 400);
    }, 3000);
  }

  /* ---- Demo form (magic link) ---- */
  var form = document.getElementById('demoForm');
  var formSuccess = document.getElementById('formSuccess');
  var formError = document.getElementById('formError');
  var submitBtn = document.getElementById('submitBtn');
  var originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = form.querySelector('#email').value.trim().toLowerCase();
      if (!email) return;

      if (formError) formError.hidden = true;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Отправка...';

      fetch('https://api.lea-dev.site/v1/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      })
        .then(function (response) {
          if (response.ok) {
            showSuccess();
          } else {
            response.json()
              .then(function (data) {
                showError(data.error || 'Ошибка сервера. Попробуйте позже.');
              })
              .catch(function () {
                showError('Ошибка сервера. Попробуйте позже.');
              });
          }
        })
        .catch(function () {
          showError('Ошибка сети. Попробуйте ещё раз.');
        });
    });
  }

  function showSuccess() {
    if (form) form.hidden = true;
    if (formSuccess) formSuccess.hidden = false;
  }

  function showError(msg) {
    if (formError) {
      formError.textContent = msg;
      formError.hidden = false;
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  }
})();
