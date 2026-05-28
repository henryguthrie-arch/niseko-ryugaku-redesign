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

    // Relative path to pages/courses.html from wherever the finder is mounted.
    // The course-product detail cards live ONLY on courses.html, so when the
    // finder appears on the homepage / LP, the "詳細を見る" link must navigate
    // cross-page. When the finder is already on courses.html, the href stays
    // anchor-only ("") and the smooth-scroll handler below intercepts the click.
    const coursesHref = (() => {
      const here = window.location.pathname;
      if (here.endsWith('/pages/courses.html')) return '';
      if (here.includes('/pages/'))             return 'courses.html';
      if (here.includes('/lp/'))                return '../pages/courses.html';
      return 'pages/courses.html'; // root: index.html
    })();

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
            <a href="${coursesHref}#course-${id}" class="result-card__link" data-program="${id}">詳細を見る →</a>
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

    /* ---------- Detail link → smooth scroll to course-product card ---------- */
    // Delegated globally so it works whether the link is inside the finder
    // or anywhere else on the page (e.g. a future "see all programs" list).
    document.addEventListener('click', (e) => {
      const link = e.target.closest('.result-card__link[href^="#course-"]');
      if (!link) return;
      const id = link.getAttribute('href').slice(1); // strip '#'
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
      // Add a brief highlight pulse so the user sees where they landed
      target.classList.add('is-target');
      setTimeout(() => target.classList.remove('is-target'), 1800);
      // Update the URL so deep-links work too
      history.replaceState(null, '', `#${id}`);
    });

    /* ============================================================
       COURSE-PRODUCT DETAIL CARDS — render one per program
       ============================================================
       The finder's "詳細を見る" links point at #course-{id}. This block
       stamps a full <article id="course-{id}"> for every program in the
       catalog into <div id="courseDetailsList">.
       To customize a card's content (weekly content matrix, features text,
       creator, etc.), edit `detailExtras` and `CONTENT_VARIANTS` below.
       ============================================================ */
    const detailHost = document.getElementById('courseDetailsList');
    if (detailHost) {
      // Per-program detail data layered on top of the finder catalog.
      // Edit any value here to change what shows up on a specific card.

      // Nozawa courses are taught by Henry Guthrie — overrides the John Kerry default.
      const NOZAWA_CREATOR = {
        name: 'Henry Guthrie',
        role: 'Otago University',
        photo: '../assets/img/creator-henry.png',
      };

      const detailExtras = {
        'niseko-basic':       { weeklyRate: 84000,  maxWeeks: 8,  defaultWeeks: 2, perWeekPrice: '¥84,000',  tags: ['通学制','本格型','ネイティブ講師'],            content: 'basic'      },
        'niseko-popular':     { weeklyRate: 80000,  maxWeeks: 12, defaultWeeks: 4, perWeekPrice: '¥80,000',  tags: ['通学制','本格型','ネイティブ講師','4週間'],   content: 'popular'    },
        'niseko-intensive':   { weeklyRate: 78000,  maxWeeks: 16, defaultWeeks: 8, perWeekPrice: '¥78,000',  tags: ['通学制','集中型','ネイティブ講師','8週間'],   content: 'intensive'  },
        'niseko-whv':         { weeklyRate: 35000,  maxWeeks: 26, defaultWeeks: 12, perWeekPrice: '¥35,000', tags: ['通学制','ワーホリ','ネイティブ講師'],          content: 'whv'        },
        'nozawa-basic':       { weeklyRate: 79000,  maxWeeks: 8,  defaultWeeks: 2, perWeekPrice: '¥79,000',  tags: ['通学制','本格型','ネイティブ講師'],            content: 'basic',     creator: NOZAWA_CREATOR },
        'nozawa-popular':     { weeklyRate: 75000,  maxWeeks: 12, defaultWeeks: 4, perWeekPrice: '¥75,000',  tags: ['通学制','本格型','ネイティブ講師','4週間'],   content: 'popular',   creator: NOZAWA_CREATOR },
        'nozawa-intensive':   { weeklyRate: 73000,  maxWeeks: 16, defaultWeeks: 8, perWeekPrice: '¥73,000',  tags: ['通学制','集中型','ネイティブ講師','8週間'],   content: 'intensive', creator: NOZAWA_CREATOR },
        'tokyo-school':       { weeklyRate: 12000,  maxWeeks: 24, defaultWeeks: 4, perWeekPrice: '¥12,000',  tags: ['通学制','気軽型','ネイティブ講師'],            content: 'casual'     },
        'online-school':      { weeklyRate: 4500,   maxWeeks: 24, defaultWeeks: 4, perWeekPrice: '¥4,500',   tags: ['オンライン','気軽型','ネイティブ講師'],         content: 'online'     },
        'tokyo-seminars':     { weeklyRate: 12000,  maxWeeks: 8,  defaultWeeks: 1, perWeekPrice: '¥12,000',  tags: ['通学制','気軽型','単発'],                      content: 'seminar', noAccommodation: true },
        'corp-niseko-retreat':{ weeklyRate: 85000,  maxWeeks: 4,  defaultWeeks: 1, perWeekPrice: '¥85,000',  tags: ['合宿','法人研修','カスタマイズ可'],            content: 'corporate'  },
        'corp-online':        { weeklyRate: 9500,   maxWeeks: 12, defaultWeeks: 4, perWeekPrice: '¥9,500',   tags: ['オンライン','法人研修','1名から'],             content: 'corpOnline', noAccommodation: true },
        'corp-tokyo-custom':  { weeklyRate: 240000, maxWeeks: 4,  defaultWeeks: 1, perWeekPrice: '¥240,000', tags: ['出張可','法人研修','1日プログラム'],           content: 'corpTokyo', noAccommodation: true },
      };

      // 6-box weekly content matrix per content variant. Edit any value to
      // change what's shown on every card that uses that variant.
      const CONTENT_VARIANTS = {
        basic: [
          { label: '授業',          value: '計 15 コマ' },
          { label: 'マンツーマン', value: 'なし' },
          { label: '発音矯正',     value: '月 1 回' },
          { label: 'アクティビティ', value: '計 3 コマ' },
          { label: 'フリー英会話', value: '1–4 時間 / 日' },
          { label: 'カウンセリング', value: '希望者いつでも' },
        ],
        popular: [
          { label: '授業',          value: '計 15 コマ' },
          { label: 'マンツーマン', value: '計 1 コマ' },
          { label: '発音矯正',     value: '月 2 回' },
          { label: 'アクティビティ', value: '計 4 コマ' },
          { label: 'フリー英会話', value: '1–4 時間 / 日' },
          { label: 'カウンセリング', value: '希望者いつでも' },
        ],
        intensive: [
          { label: '授業',          value: '計 15 コマ' },
          { label: 'マンツーマン', value: '計 3 コマ' },
          { label: '発音矯正',     value: '週 1 回' },
          { label: 'アクティビティ', value: '計 5 コマ' },
          { label: 'フリー英会話', value: '1–4 時間 / 日' },
          { label: 'カウンセリング', value: '希望者いつでも' },
        ],
        whv: [
          { label: '授業',          value: '計 10 コマ' },
          { label: 'マンツーマン', value: '計 1 コマ' },
          { label: '発音矯正',     value: '月 2 回' },
          { label: 'アクティビティ', value: '計 2 コマ' },
          { label: '仕事サポート', value: 'あり' },
          { label: 'カウンセリング', value: '希望者いつでも' },
        ],
        casual: [
          { label: '授業',          value: '計 4 コマ' },
          { label: 'マンツーマン', value: 'なし' },
          { label: '発音矯正',     value: '月 1 回' },
          { label: 'アクティビティ', value: '計 1 コマ' },
          { label: 'フリー英会話', value: '30 分 / 日' },
          { label: 'カウンセリング', value: '希望者いつでも' },
        ],
        online: [
          { label: '授業',          value: '計 4 コマ' },
          { label: 'マンツーマン', value: 'なし' },
          { label: '発音矯正',     value: '月 1 回' },
          { label: '宿題サポート', value: 'あり' },
          { label: 'フリー英会話', value: 'オンライン' },
          { label: 'カウンセリング', value: '希望者いつでも' },
        ],
        seminar: [
          { label: 'セッション',   value: '90 分' },
          { label: '形式',          value: '対面' },
          { label: 'ネイティブ講師', value: 'あり' },
          { label: '少人数',       value: '最大 8 名' },
          { label: 'テーマ',       value: '毎月変更' },
          { label: '質疑応答',     value: 'あり' },
        ],
        corporate: [
          { label: '研修日数',     value: '5 日間' },
          { label: '1 日あたり',   value: '6 時間' },
          { label: 'マンツーマン', value: '計 3 コマ' },
          { label: 'チームワーク', value: '計 5 コマ' },
          { label: 'プレゼン演習', value: 'あり' },
          { label: 'レポート',     value: '研修後提供' },
        ],
        corpOnline: [
          { label: 'セッション',   value: '週 2 回' },
          { label: '1 回',         value: '45 分' },
          { label: 'マンツーマン', value: 'あり' },
          { label: '形式',          value: 'オンライン' },
          { label: '少人数',       value: '最大 4 名' },
          { label: 'レポート',     value: '月次' },
        ],
        corpTokyo: [
          { label: '研修時間',     value: '6 時間 / 日' },
          { label: '対象',          value: '貴社 1 チーム' },
          { label: 'カスタマイズ', value: '内容に合わせて' },
          { label: 'ネイティブ講師', value: '2 名体制' },
          { label: '教材',          value: 'オリジナル' },
          { label: '事後レポート', value: 'あり' },
        ],
      };

      // Edit-here defaults — these are the placeholders shown on EVERY card
      // until the user customizes per-program.
      const DEFAULT_FEATURES = [
        { title: '特徴タイトル 1（後ほど追加）', body: 'こちらに 1 文の説明を記入してください。' },
        { title: '特徴タイトル 2（後ほど追加）', body: 'こちらに 1 文の説明を記入してください。' },
        { title: '特徴タイトル 3（後ほど追加）', body: 'こちらに 1 文の説明を記入してください。' },
      ];
      const DEFAULT_CREATOR = {
        name: 'John Kerry',
        role: 'Bachelor of Education — La Trobe University, Melbourne, Australia',
        photo: '../assets/img/creator-john.png',
      };

      const escapeHtml = (s) => String(s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

      function renderCourseProduct(id, p, x) {
        const content = CONTENT_VARIANTS[x.content] || CONTENT_VARIANTS.popular;
        const features = x.features || DEFAULT_FEATURES;
        const creator = x.creator || DEFAULT_CREATOR;
        const sliderId = `calc-${id}`;
        const accId = `acc-${id}`;
        const initialTotal = (x.defaultWeeks * (x.weeklyRate + (x.noAccommodation ? 0 : 35000)))
          .toLocaleString('ja-JP');
        const accBlock = x.noAccommodation ? '' : `
                <div class="course-product__calc-row course-product__calc-row--select">
                  <label for="${accId}">宿泊</label>
                  <select id="${accId}" data-calc-acc aria-label="宿泊タイプ">
                    <option value="private" data-rate="35000" selected>プライベートルーム (+¥35,000 / 週)</option>
                    <option value="twin" data-rate="22000">ツインシェア (+¥22,000 / 週)</option>
                    <option value="triple" data-rate="15000">トリプルシェア (+¥15,000 / 週)</option>
                  </select>
                </div>`;
        return `
        <article id="course-${id}" class="course-product course-product--${p.accent}">
          <div class="course-product__body">

            <!-- Header -->
            <header class="course-product__head">
              <span class="course-product__location">
                ${ICONS.loc[p.locKey]}
                <span>${escapeHtml(p.loc)}</span>
              </span>
              <h3 class="course-product__title">${escapeHtml(p.jp)}</h3>
              <p class="course-product__en">${escapeHtml(p.en)}</p>
              <ul class="course-product__feats">
                ${x.tags.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
              </ul>
              <p class="course-product__price">${x.perWeekPrice}<span>〜 / 週</span></p>
            </header>

            <!-- Photo + price calculator (side-by-side) -->
            <div class="course-product__grid">
              <figure class="course-product__photo course-product__photo--empty" aria-label="コース写真（後ほど追加）"></figure>

              <div class="course-product__calc" data-calc data-weekly-rate="${x.weeklyRate}">
                <p class="course-product__sub-head">料金シミュレーター</p>
                <div class="course-product__calc-row">
                  <label for="${sliderId}">期間</label>
                  <output for="${sliderId}" data-calc-weeks>${x.defaultWeeks} 週間</output>
                </div>
                <input type="range" id="${sliderId}" min="1" max="${x.maxWeeks}" value="${x.defaultWeeks}" step="1" data-calc-input aria-label="受講期間（週）">
                ${accBlock}
                <div class="course-product__calc-total">
                  <span>合計目安</span>
                  <output data-calc-total>${initialTotal}</output>
                </div>
              </div>
            </div>

            <!-- Weekly content matrix -->
            <div class="course-product__contents">
              <p class="course-product__sub-head">コース内容（1週間あたり）</p>
              <ul class="course-product__contents-grid">
                ${content.map((c) => `<li><strong>${escapeHtml(c.label)}</strong><span>${escapeHtml(c.value)}</span></li>`).join('')}
              </ul>
            </div>

            <!-- Course features -->
            <div class="course-product__features">
              <p class="course-product__sub-head">Course Features</p>
              <ul class="course-product__features-list">
                ${features.map((f) => `<li><strong>${escapeHtml(f.title)}</strong><p>${escapeHtml(f.body)}</p></li>`).join('')}
              </ul>
            </div>

            <!-- Course creator / lead instructor -->
            <div class="course-product__creator">
              <p class="course-product__sub-head">コース監修</p>
              <div class="course-product__creator-card">
                <div class="course-product__creator-photo">
                  <img src="${creator.photo}" alt="講師 ${escapeHtml(creator.name)} の写真" loading="lazy" />
                </div>
                <div>
                  <p class="course-product__creator-name">${escapeHtml(creator.name)}</p>
                  <p class="course-product__creator-role">${escapeHtml(creator.role)}</p>
                </div>
              </div>
            </div>

            <!-- CTA banner -->
            <div class="course-product__cta">
              <div class="course-product__cta-body">
                <p class="course-product__cta-eyebrow">Would you like to get started?</p>
                <h4 class="course-product__cta-title">Book a free consultation</h4>
                <a href="../index.html#contact" class="course-product__cta-button">
                  予約はこちら
                  <span class="course-product__cta-button-arrow" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8 L13 8 M9 4 L13 8 L9 12"/></svg>
                  </span>
                </a>
              </div>
              <div class="course-product__cta-photo">
                <img src="../assets/img/moeko.png" alt="無料カウンセリング担当 Moeko" loading="lazy" />
              </div>
            </div>

          </div>
        </article>`;
      }

      detailHost.innerHTML = Object.entries(programs)
        .filter(([id]) => detailExtras[id])  // skip any program without detail config
        .map(([id, p]) => renderCourseProduct(id, p, detailExtras[id]))
        .join('\n');

      // If we arrived with a #course-{id} hash (e.g. clicked through from the
      // finder on the homepage), scroll to that card now — the renderer has
      // only just stamped it into the DOM, so the browser's own scroll-to-anchor
      // fired before the element existed.
      if (window.location.hash.startsWith('#course-')) {
        const target = document.getElementById(window.location.hash.slice(1));
        if (target) {
          requestAnimationFrame(() => {
            const top = target.getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top, behavior: 'auto' });
            target.classList.add('is-target');
            setTimeout(() => target.classList.remove('is-target'), 1800);
          });
        }
      }
    }
  })();

  /* ---------- Course-product price calculator ----------
     Auto-wires every <div data-calc data-weekly-rate="N"> with:
       <input data-calc-input>          → slider for # of weeks
       <output data-calc-weeks>         → live "N 週間" label
       <output data-calc-total>         → live ¥ total (formatted with commas)
       <select data-calc-acc>           → optional accommodation dropdown
                                          (each <option data-rate="N"> adds N per week)
  */
  document.querySelectorAll('[data-calc]').forEach((calc) => {
    const input = calc.querySelector('[data-calc-input]');
    const weeksOut = calc.querySelector('[data-calc-weeks]');
    const totalOut = calc.querySelector('[data-calc-total]');
    const accSelect = calc.querySelector('[data-calc-acc]');
    const weeklyRate = Number(calc.dataset.weeklyRate || 0);
    if (!input || !weeklyRate) return;

    const fmt = (n) => n.toLocaleString('ja-JP');
    const update = () => {
      const weeks = Number(input.value);
      const accRate = accSelect
        ? Number(accSelect.selectedOptions[0]?.dataset.rate || 0)
        : 0;
      if (weeksOut) weeksOut.value = `${weeks} 週間`;
      if (totalOut) totalOut.value = fmt(weeks * (weeklyRate + accRate));
    };
    input.addEventListener('input', update);
    if (accSelect) accSelect.addEventListener('change', update);
    update();
  });

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
