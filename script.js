document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     THEME TOGGLE (dark default, no persistence — in-memory only)
  ----------------------------------------------------------- */
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const knobIcon = document.getElementById('knobIcon');

  function setTheme(theme){
    root.setAttribute('data-theme', theme);
    if (knobIcon){
      knobIcon.className = theme === 'dark' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
    }
  }

  // Default to the visitor's system preference if available, else dark
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(prefersLight ? 'light' : 'dark');

  toggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* -----------------------------------------------------------
     HERO — typed SQL query + mini bar chart draw-in
  ----------------------------------------------------------- */
  const query = "SELECT insight FROM raw_data WHERE curiosity = true;";
  const typedEl = document.getElementById('typedQuery');
  let i = 0;

  function typeQuery(){
    if (!typedEl) return;
    if (i <= query.length){
      typedEl.textContent = query.slice(0, i);
      i++;
      setTimeout(typeQuery, 38);
    } else {
      // once typing finishes, draw the mini chart
      const bars = document.querySelectorAll('#miniChart .bar');
      const heights = [35, 55, 40, 70, 60, 85, 65, 95];
      bars.forEach((bar, idx) => {
        setTimeout(() => { bar.style.height = heights[idx] + '%'; }, idx * 60);
      });
    }
  }
  setTimeout(typeQuery, 500);

  /* -----------------------------------------------------------
     STAT COUNTERS — animate up when scrolled into view
  ----------------------------------------------------------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const tick = () => {
          current += step;
          if (current >= target){
            el.textContent = target;
          } else {
            el.textContent = current;
            requestAnimationFrame(tick);
          }
        };
        tick();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  /* -----------------------------------------------------------
     SKILL BARS — fill when scrolled into view
  ----------------------------------------------------------- */
  const fills = document.querySelectorAll('.skill-fill');
  const fillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const el = entry.target;
        el.style.width = el.getAttribute('data-fill') + '%';
        fillObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => fillObserver.observe(f));

  /* -----------------------------------------------------------
     REVEAL ON SCROLL
  ----------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* -----------------------------------------------------------
     BACK TO TOP
  ----------------------------------------------------------- */
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500){ toTop.classList.add('show'); }
    else { toTop.classList.remove('show'); }
  });
  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* -----------------------------------------------------------
     CONTACT FORM — client-side validation + simulated send
     (No backend wired up: swap the setTimeout block for a real
     fetch() call to your form endpoint, e.g. Formspree or your API.)
  ----------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()){
      form.reportValidity();
      return;
    }
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Sending...';
    status.className = 'form-status show';
    status.textContent = '';

    setTimeout(() => {
      status.classList.add('ok');
      status.textContent = '✓ Message sent — I\'ll get back to you within a couple of days.';
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="bi bi-send-fill"></i> Send message';
      form.reset();
    }, 1000);
  });

  /* -----------------------------------------------------------
     FOOTER YEAR
  ----------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------
     NAVBAR — collapse mobile menu after clicking a link
  ----------------------------------------------------------- */
  document.querySelectorAll('#navMenu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.getElementById('navMenu');
      if (menu.classList.contains('show')){
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

});
