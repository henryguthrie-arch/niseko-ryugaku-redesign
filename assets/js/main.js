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
    // locKey: niseko | tokyo | nozawa | online   → which location icon
    // formatKey: inperson | online               → which format icon
    // tag: intensive | casual                    → which intensity icon
    const programs = {
      'niseko-basic': {
        jp: 'ニセコ留学 ベーシックプラン', en: 'Niseko Ryugaku Basic Plan',
        loc: 'ニセコ', locKey: 'niseko', formatKey: 'inperson',
        tag: 'intensive', seasons: ['summer','winter'],
        price: '¥168,000', priceNote: '〜 / 2週間', accent: 'coral',
      },
      'niseko-popular': {
        jp: 'ニセコ留学 人気プラン', en: 'Niseko Ryugaku Popular Plan',
        loc: 'ニセコ', locKey: 'niseko', formatKey: 'inperson',
        tag: 'intensive', seasons: ['summer','winter'],
        price: '¥320,000', priceNote: '〜 / 4週間', accent: 'coral', badge: '人気No.1',
      },
      'niseko-intensive': {
        jp: 'ニセコ留学 集中プラン', en: 'Niseko Ryugaku Intensive Plan',
        loc: 'ニセコ', locKey: 'niseko', formatKey: 'inperson',
        tag: 'intensive', seasons: ['summer','winter'],
        price: '¥620,000', priceNote: '〜 / 8週間', accent: 'coral',
      },
      'niseko-whv': {
        jp: 'ニセコ ワーホリプラン', en: 'Niseko WHV Plan',
        loc: 'ニセコ', locKey: 'niseko', formatKey: 'inperson',
        tag: 'intensive', seasons: ['summer','winter'],
        price: '¥420,000', priceNote: '〜 / 3ヶ月', accent: 'coral',
      },
      'nozawa-basic': {
        jp: '野沢留学 ベーシックプラン', en: 'Nozawa Ryugaku Basic Plan',
        loc: '野沢温泉', locKey: 'nozawa', formatKey: 'inperson',
        tag: 'intensive', seasons: ['spring'],
        price: '¥158,000', priceNote: '〜 / 2週間', accent: 'teal',
      },
      'nozawa-popular': {
        jp: '野沢留学 人気プラン', en: 'Nozawa Ryugaku Popular Plan',
        loc: '野沢温泉', locKey: 'nozawa', formatKey: 'inperson',
        tag: 'intensive', seasons: ['spring'],
        price: '¥298,000', priceNote: '〜 / 4週間', accent: 'teal',
      },
      'nozawa-intensive': {
        jp: '野沢留学 集中プラン', en: 'Nozawa Ryugaku Intensive Plan',
        loc: '野沢温泉', locKey: 'nozawa', formatKey: 'inperson',
        tag: 'intensive', seasons: ['spring'],
        price: '¥580,000', priceNote: '〜 / 8週間', accent: 'teal',
      },
      'tokyo-school': {
        jp: '東京スクール', en: 'Tokyo School',
        loc: '東京・通学', locKey: 'tokyo', formatKey: 'inperson',
        tag: 'casual', seasons: ['spring','summer','winter'],
        price: '¥48,000', priceNote: '/ 月〜', accent: 'ink',
      },
      'online-school': {
        jp: 'オンラインスクール', en: 'Online School',
        loc: 'オンライン', locKey: 'online', formatKey: 'online',
        tag: 'casual', seasons: ['spring','summer','winter'],
        price: '¥18,000', priceNote: '/ 月〜', accent: 'ink',
      },
      'tokyo-seminars': {
        jp: '東京コンサルティングセミナー', en: 'Tokyo Consulting Seminars',
        loc: '東京・通学', locKey: 'tokyo', formatKey: 'inperson',
        tag: 'casual', seasons: ['spring','summer','winter'],
        price: '¥12,000', priceNote: '/ 回〜', accent: 'ink',
      },
      // Corporate training programs — appear when intensity === 'corporate'.
      'corp-niseko-retreat': {
        jp: 'ニセコ法人合宿プラン', en: 'Niseko Corporate Retreat',
        loc: 'ニセコ', locKey: 'niseko', formatKey: 'inperson',
        tag: 'corporate', seasons: ['spring','summer','winter'],
        price: '¥85,000', priceNote: '/ 1名・5日間', accent: 'coral',
      },
      'corp-online': {
        jp: 'オンライン法人研修', en: 'Corporate Online Training',
        loc: 'オンライン', locKey: 'online', formatKey: 'online',
        tag: 'corporate', seasons: ['spring','summer','winter'],
        price: '¥38,000', priceNote: '/ 月・1名〜', accent: 'ink',
      },
      'corp-tokyo-custom': {
        jp: '東京カスタム研修', en: 'Tokyo Custom Training',
        loc: '東京・出張可', locKey: 'tokyo', formatKey: 'inperson',
        tag: 'corporate', seasons: ['spring','summer','winter'],
        price: '¥240,000', priceNote: '/ 1日', accent: 'ink',
      },
    };

    // Icon set — kept inline strings so the renderer can stamp them via
    // template literals without extra DOM gymnastics.
    const ICONS = {
      loc: {
        niseko: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M2 16 L7 7 L10 11 L13 5 L18 16 Z"/><path d="M11.5 7.5 L13 5 L14.5 7.5 L13.8 8 L13 7 L12.2 8 Z" fill="currentColor"/></svg>',
        tokyo:  '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M3 17 L3 9 L6 9 L6 6 L10 6 L10 3 L14 3 L14 9 L17 9 L17 17 Z"/><path d="M7 11.5 L7.6 11.5 M7 13.5 L7.6 13.5 M11.5 7 L12.2 7 M11.5 10 L12.2 10 M11.5 13 L12.2 13" stroke-linecap="round"/></svg>',
        nozawa: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 15 Q5 13 8 15 T14 15 T18 15"/><path d="M2 17.5 Q5 16 8 17.5 T14 17.5 T18 17.5"/><path d="M6 9 Q7 7 6 5 M10 9 Q11 7 10 5 M14 9 Q15 7 14 5"/></svg>',
        online: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 8 Q10 2 17 8 M5 11 Q10 7 15 11 M7 14 Q10 12 13 14"/><circle cx="10" cy="16.5" r="1" fill="currentColor" stroke="none"/></svg>',
      },
      format: {
        inperson: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M3 17 L3 6 L17 6 L17 17 Z"/><path d="M8 17 L8 11 L12 11 L12 17"/></svg>',
        online:   '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3" y="5" width="14" height="9" rx="1"/><path d="M1 16 L19 16" stroke-linecap="round"/></svg>',
      },
      intensity: {
        intensive: '<svg viewBox="0 0 20 20" stroke="currentColor" stroke-width="0.8" fill="currentColor" stroke-linejoin="round"><path d="M11 1 L5 11 L9 11 L8 19 L15 8 L11 8 Z"/></svg>',
        casual:    '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><path d="M3 17 Q6 5 17 3 Q15 14 3 17"/><path d="M3 17 Q10 12 17 3"/></svg>',
        corporate: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M3 6 L17 6 L17 16 L3 16 Z"/><path d="M7 6 L7 4.5 Q7 4 7.5 4 L12.5 4 Q13 4 13 4.5 L13 6"/><line x1="3" y1="10" x2="17" y2="10" stroke-linecap="round"/></svg>',
      },
      native: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><path d="M3 4 L17 4 L17 13 L11 13 L8 16 L8 13 L3 13 Z"/><circle cx="7" cy="8.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="10" cy="8.5" r="0.9" fill="currentColor" stroke="none"/><circle cx="13" cy="8.5" r="0.9" fill="currentColor" stroke="none"/></svg>',
    };

    const formatText    = { inperson: '通学制', online: 'オンライン' };
    const intensityText = { intensive: '集中型', casual: '気軽型', corporate: '研修型' };

    const state = { intensity: null, season: null, step: 1 };

    const intensityLabel = { intensive: '本格コース', casual: '気軽なコース', corporate: '法人研修', any: 'すべてのコース' };
    const seasonLabel    = { spring: '春', summer: '夏', winter: '冬', anytime: 'いつでもOK' };

    const $steps   = root.querySelectorAll('.finder__step');
    const $crumbs  = root.querySelectorAll('.finder__progress li');
    const $summary = document.getElementById('finderSummary');
    const $results = document.getElementById('finderResults');

    function filter(intensity, season) {
      return Object.entries(programs).filter(([_, p]) => {
        const intensityOK = intensity === 'any' || p.tag === intensity;
        const seasonOK = season === 'anytime' || p.seasons.includes(season);
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
          <header class="result-card__head">
            <span class="result-card__location">
              <span class="result-card__location-icon" aria-hidden="true">${ICONS.loc[p.locKey]}</span>
              <span class="result-card__location-text">${p.loc}</span>
            </span>
          </header>
          <h4 class="result-card__title">${p.jp}</h4>
          <p class="result-card__en">${p.en}</p>
          <ul class="result-card__feats" aria-label="プログラムの特徴">
            <li class="feat feat--format" aria-label="${formatText[p.formatKey]}">
              <span class="feat__icon" aria-hidden="true">${ICONS.format[p.formatKey]}</span>
              <span>${formatText[p.formatKey]}</span>
            </li>
            <li class="feat feat--intensity feat--intensity-${p.tag}" aria-label="${intensityText[p.tag]}">
              <span class="feat__icon" aria-hidden="true">${ICONS.intensity[p.tag]}</span>
              <span>${intensityText[p.tag]}</span>
            </li>
            <li class="feat feat--native" aria-label="ネイティブ講師">
              <span class="feat__icon" aria-hidden="true">${ICONS.native}</span>
              <span>ネイティブ講師</span>
            </li>
          </ul>
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
