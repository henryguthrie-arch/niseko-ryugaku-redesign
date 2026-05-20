/* Niseko Ryugaku — homepage interactions */

(function () {
  'use strict';

  /* ---------- Header: shrink on scroll ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // close after clicking a link
    siteNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Testimonials carousel ---------- */
  const track = document.getElementById('voicesTrack');
  const prev = document.querySelector('.voices__prev');
  const next = document.querySelector('.voices__next');
  if (track && prev && next) {
    const step = () => {
      const card = track.querySelector('.voice');
      if (!card) return 320;
      const gap = parseFloat(getComputedStyle(track).columnGap || '20');
      return card.getBoundingClientRect().width + gap;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.counter);
      const duration = 1400;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const v = target * ease(t);
        el.textContent = Number.isInteger(target) ? Math.round(v) : v.toFixed(1);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => {
      el.textContent = '0';
      io.observe(el);
    });
  }

  /* ---------- Program Finder ---------- */
  (() => {
    const root = document.getElementById('finder');
    if (!root) return;

    // Program catalog. accent = which color stripe shows on the result card.
    const programs = {
      'niseko-basic': {
        jp: 'ニセコ留学 ベーシックプラン', en: 'Niseko Ryugaku Basic Plan',
        loc: 'ニセコ', tag: 'intensive', seasons: ['summer','winter'],
        price: '¥168,000', priceNote: '〜 / 2週間', accent: 'coral',
      },
      'niseko-popular': {
        jp: 'ニセコ留学 人気プラン', en: 'Niseko Ryugaku Popular Plan',
        loc: 'ニセコ', tag: 'intensive', seasons: ['summer','winter'],
        price: '¥320,000', priceNote: '〜 / 4週間', accent: 'coral', badge: '人気No.1',
      },
      'niseko-intensive': {
        jp: 'ニセコ留学 集中プラン', en: 'Niseko Ryugaku Intensive Plan',
        loc: 'ニセコ', tag: 'intensive', seasons: ['summer','winter'],
        price: '¥620,000', priceNote: '〜 / 8週間', accent: 'coral',
      },
      'niseko-whv': {
        jp: 'ニセコ ワーホリプラン', en: 'Niseko WHV Plan',
        loc: 'ニセコ', tag: 'intensive', seasons: ['summer','winter'],
        price: '¥420,000', priceNote: '〜 / 3ヶ月', accent: 'coral',
      },
      'nozawa-basic': {
        jp: '野沢留学 ベーシックプラン', en: 'Nozawa Ryugaku Basic Plan',
        loc: '野沢温泉', tag: 'intensive', seasons: ['spring'],
        price: '¥158,000', priceNote: '〜 / 2週間', accent: 'teal',
      },
      'nozawa-popular': {
        jp: '野沢留学 人気プラン', en: 'Nozawa Ryugaku Popular Plan',
        loc: '野沢温泉', tag: 'intensive', seasons: ['spring'],
        price: '¥298,000', priceNote: '〜 / 4週間', accent: 'teal',
      },
      'nozawa-intensive': {
        jp: '野沢留学 集中プラン', en: 'Nozawa Ryugaku Intensive Plan',
        loc: '野沢温泉', tag: 'intensive', seasons: ['spring'],
        price: '¥580,000', priceNote: '〜 / 8週間', accent: 'teal',
      },
      'tokyo-school': {
        jp: '東京スクール', en: 'Tokyo School',
        loc: '東京・通学', tag: 'casual', seasons: ['spring','summer','winter'],
        price: '¥48,000', priceNote: '/ 月〜', accent: 'ink',
      },
      'online-school': {
        jp: 'オンラインスクール', en: 'Online School',
        loc: 'オンライン', tag: 'casual', seasons: ['spring','summer','winter'],
        price: '¥18,000', priceNote: '/ 月〜', accent: 'ink',
      },
      'tokyo-seminars': {
        jp: '東京コンサルティングセミナー', en: 'Tokyo Consulting Seminars',
        loc: '東京・通学', tag: 'casual', seasons: ['spring','summer','winter'],
        price: '¥12,000', priceNote: '/ 回〜', accent: 'ink',
      },
    };

    const state = { intensity: null, season: null, step: 1 };

    const intensityLabel = { intensive: '本格コース', casual: '気軽なコース', any: 'すべてのコース' };
    const seasonLabel    = { spring: '春', summer: '夏', winter: '冬' };

    const $steps   = root.querySelectorAll('.finder__step');
    const $crumbs  = root.querySelectorAll('.finder__progress li');
    const $summary = document.getElementById('finderSummary');
    const $results = document.getElementById('finderResults');

    function filter(intensity, season) {
      return Object.entries(programs).filter(([_, p]) => {
        const intensityOK = intensity === 'any' || p.tag === intensity;
        const seasonOK = p.seasons.includes(season);
        return intensityOK && seasonOK;
      });
    }

    function goTo(step) {
      state.step = step;
      $steps.forEach((el) => {
        el.classList.toggle('is-active', Number(el.dataset.step) === step);
      });
      $crumbs.forEach((el) => {
        const n = Number(el.dataset.step);
        el.classList.toggle('is-active', n === step);
        el.classList.toggle('is-done', n < step);
      });
      if (step === 3) renderResults();
      // scroll the shell into view so the user sees the new step
      const shellTop = root.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > shellTop + 200 || window.scrollY < shellTop - 400) {
        window.scrollTo({ top: shellTop, behavior: 'smooth' });
      }
    }

    function renderResults() {
      const results = filter(state.intensity, state.season);
      $summary.innerHTML =
        `<strong>${intensityLabel[state.intensity]}</strong> × <strong>${seasonLabel[state.season]}</strong>` +
        ` のおすすめ <span class="finder__count">${results.length}件</span>`;

      if (results.length === 0) {
        $results.innerHTML = `<p class="finder__none">該当するプログラムが見つかりませんでした。<button type="button" data-action="restart">条件を変える</button></p>`;
        return;
      }

      $results.innerHTML = results.map(([id, p]) => `
        <article class="result-card result-card--${p.accent}" role="listitem">
          ${p.badge ? `<span class="result-card__badge">${p.badge}</span>` : ''}
          <div class="result-card__head">
            <span class="result-card__location">📍 ${p.loc}</span>
          </div>
          <h4 class="result-card__title">${p.jp}</h4>
          <p class="result-card__en">${p.en}</p>
          <div class="result-card__foot">
            <span class="result-card__price">${p.price}<small>${p.priceNote}</small></span>
            <a href="#contact" class="result-card__link" data-program="${id}">詳細を見る →</a>
          </div>
        </article>
      `).join('');
    }

    root.addEventListener('click', (e) => {
      const choice = e.target.closest('.choice');
      if (choice) {
        const step = Number(choice.closest('.finder__step').dataset.step);
        const key = choice.dataset.key;
        if (step === 1) { state.intensity = key; goTo(2); }
        else if (step === 2) { state.season = key; goTo(3); }
        return;
      }
      const back = e.target.closest('.finder__back');
      if (back) { goTo(Number(back.dataset.back)); return; }
      const restart = e.target.closest('.finder__restart, [data-action="restart"]');
      if (restart) {
        state.intensity = null;
        state.season = null;
        goTo(1);
      }
    });
  })();

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach((el) => io.observe(el));
  }
})();
