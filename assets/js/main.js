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
        jp: 'ニセコ留学 ポピュラープラン', en: 'Niseko Ryugaku Popular Plan',
        loc: 'ニセコ', locKey: 'niseko', formatKey: 'inperson',
        tag: 'intensive', seasons: ['summer','winter'],
        price: '¥320,000', priceNote: '〜 / 4週間', accent: 'coral', badge: '人気No.1',
      },
      'niseko-intensive': {
        jp: 'ニセコ留学 フォーカスプラン', en: 'Niseko Ryugaku Focus Plan',
        loc: 'ニセコ', locKey: 'niseko', formatKey: 'inperson',
        tag: 'intensive', seasons: ['summer','winter'],
        price: '¥620,000', priceNote: '〜 / 8週間', accent: 'coral',
      },
      'niseko-whv': {
        jp: 'ニセコ留学ワーホリプラン', en: 'Niseko Ryugaku Working Holiday Plan',
        loc: 'ニセコ', locKey: 'niseko', formatKey: 'inperson',
        tag: 'intensive', seasons: ['summer','winter'],
        price: '¥99,000', priceNote: '/ 1週間', accent: 'coral',
      },
      'nozawa-basic': {
        jp: '野沢留学 ベーシックプラン', en: 'Nozawa Ryugaku Basic Plan',
        loc: '野沢温泉', locKey: 'nozawa', formatKey: 'inperson',
        tag: 'intensive', seasons: ['spring'],
        price: '¥158,000', priceNote: '〜 / 2週間', accent: 'teal',
      },
      'nozawa-popular': {
        jp: '野沢留学 ポピュラープラン', en: 'Nozawa Ryugaku Popular Plan',
        loc: '野沢温泉', locKey: 'nozawa', formatKey: 'inperson',
        tag: 'intensive', seasons: ['spring'],
        price: '¥298,000', priceNote: '〜 / 4週間', accent: 'teal',
      },
      'nozawa-intensive': {
        jp: '野沢留学 フォーカスプラン', en: 'Nozawa Ryugaku Focus Plan',
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
      'tokyo-seminars': {
        jp: '東京コンサルティングセミナー', en: 'Tokyo Consulting Seminars',
        loc: '東京・通学', locKey: 'tokyo', formatKey: 'inperson',
        tag: 'casual', seasons: ['spring','summer','winter'],
        price: '¥12,000', priceNote: '/ 回〜', accent: 'ink',
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

    // Path to /assets/img depends on whether main.js runs from the site root
    // (index.html) or a subfolder (pages/, lp/). Mirror coursesHref's logic.
    const imgBase = (() => {
      const here = window.location.pathname;
      return (here.includes('/pages/') || here.includes('/lp/')) ? '../assets/img/' : 'assets/img/';
    })();
    // Academy crest per location — shown instead of the icon+text label.
    // Online programs are run out of the Tokyo academy, so they use its crest.
    const LOC_LOGOS = {
      niseko: 'niseko-logo.png',
      nozawa: 'nozawa-logo.png',
      tokyo:  'tokyo-logo.png',
      online: 'tokyo-logo.png',
    };

    const intensityLabel = { intensive: '留学コース', casual: '気軽なコース', corporate: '法人研修', any: 'すべてのコース' };
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

    // Each location collapses its programs into ONE finder card + ONE detail
    // card with a plan dropdown. Declared in the IIFE scope so the finder
    // (collapse) and the detail renderer (combine) both see it.
    // plan.plan = PRICING_TABLE key (sheet pricing) or null (= linear weeklyRate).
    const LOCATION_GROUPS = {
      niseko: {
        title: 'ニセコ留学', en: 'Niseko Ryugaku', loc: 'ニセコ', locKey: 'niseko', accent: 'coral',
        memberIds: ['niseko-basic', 'niseko-popular', 'niseko-intensive'],
        groupTag: 'intensive', fromPrice: '¥99,000', fromNote: '〜 / 週',
        features: [
          { title: 'パスポート不要の海外体験', body: '国内にいながら、外国人だらけの環境にどっぷり浸かれます。' },
          { title: 'レッスン外も英語漬け', body: '街もスタッフもゲストも英語。教室の外もそのまま実践の場です。' },
          { title: '海外より安く海外体験', body: '渡航費・ビザ不要で、短期でも本気の英語漬け（イマージョン）留学を。' },
        ],
        plans: [
          { value: 'basic',   label: 'ベーシックプラン', quoteName: 'ニセコ留学 ベーシックプラン', content: 'basic',     plan: 'basic',   weeklyRate: 84000, maxWeeks: 24, defaultWeeks: 2 },
          { value: 'popular', label: 'ポピュラープラン',       quoteName: 'ニセコ留学 ポピュラープラン',       content: 'popular',   plan: 'popular', weeklyRate: 80000, maxWeeks: 24, defaultWeeks: 4 },
          { value: 'focus',   label: 'フォーカスプラン', quoteName: 'ニセコ留学 フォーカスプラン', content: 'intensive', plan: 'focus',   weeklyRate: 78000, maxWeeks: 24, defaultWeeks: 8 },
        ],
        // ワーホリプラン is now a standalone card (niseko-whv), not a group member.
      },
      nozawa: {
        title: '野沢留学', en: 'Nozawa Ryugaku', loc: '野沢温泉', locKey: 'nozawa', accent: 'teal',
        memberIds: ['nozawa-basic', 'nozawa-popular', 'nozawa-intensive'],
        groupTag: 'intensive', fromPrice: '¥99,000', fromNote: '〜 / 週',
        tags: ['通学制', 'ネイティブ講師', 'プラン選択可', '春季限定 🌸'],
        plans: [
          { value: 'basic',   label: 'ベーシックプラン', quoteName: '野沢留学 ベーシックプラン', content: 'basic',     plan: 'basic',   weeklyRate: 79000, maxWeeks: 24, defaultWeeks: 2 },
          { value: 'popular', label: 'ポピュラープラン',       quoteName: '野沢留学 ポピュラープラン',       content: 'popular',   plan: 'popular', weeklyRate: 75000, maxWeeks: 24, defaultWeeks: 4 },
          { value: 'focus',   label: 'フォーカスプラン', quoteName: '野沢留学 フォーカスプラン', content: 'intensive', plan: 'focus',   weeklyRate: 73000, maxWeeks: 24, defaultWeeks: 8 },
        ],
      },
      tokyo: {
        title: '東京留学', en: 'Tokyo Ryugaku', loc: '東京・通学', locKey: 'tokyo', accent: 'ink',
        memberIds: ['tokyo-school', 'tokyo-seminars'],
        groupTag: 'casual', fromPrice: '¥110,000', fromNote: '/ 月〜',
        contentHeading: 'コース内容（1ヶ月あたり）',
        unit: 'ヶ月',
        ribbon: '2026年9月開講',
        features: [
          { title: '社会人でも気軽に参加可能', body: '仕事を続けながら、留学レベルのレッスンが受けられます。' },
          { title: '海外留学の半分以下のコスト', body: '渡航費・滞在費ゼロで本格的な英語学習を。' },
          { title: 'ニセコ留学へのステップにも', body: '東京で基礎を固めて、ニセコ留学へ進む流れもOK。' },
        ],
        plans: [
          { value: 'basic',   label: 'ベーシックプラン', quoteName: '東京留学 ベーシックプラン', content: 'tokyoBasic',   plan: null, weeklyRate: 110000, maxWeeks: 24, defaultWeeks: 2, noAccommodation: true },
          { value: 'popular', label: 'ポピュラープラン',       quoteName: '東京留学 ポピュラープラン',       content: 'tokyoPopular', plan: null, weeklyRate: 120000, maxWeeks: 24, defaultWeeks: 4, noAccommodation: true },
          { value: 'focus',   label: 'フォーカスプラン', quoteName: '東京留学 フォーカスプラン', content: 'tokyoFocus',   plan: null, weeklyRate: 130000, maxWeeks: 24, defaultWeeks: 8, noAccommodation: true },
        ],
      },
    };
    // member program id → group key
    const MEMBER_TO_GROUP = {};
    Object.entries(LOCATION_GROUPS).forEach(([key, g]) => g.memberIds.forEach((id) => { MEMBER_TO_GROUP[id] = key; }));

    // Collapse each location's member programs down to one group card.
    function collapseGroups(entries) {
      const out = [];
      const added = new Set();
      for (const e of entries) {
        const key = MEMBER_TO_GROUP[e[0]];
        if (key) {
          if (!added.has(key)) {
            const g = LOCATION_GROUPS[key];
            out.push([key, {
              jp: g.title, en: g.en, loc: g.loc, locKey: g.locKey, formatKey: 'inperson',
              tag: g.groupTag, accent: g.accent, price: g.fromPrice, priceNote: g.fromNote,
              isGroup: true, planCount: g.plans.length,
            }]);
            added.add(key);
          }
        } else {
          out.push(e);
        }
      }
      return out;
    }

    function renderResults() {
      const results = collapseGroups(filter(state.intensity, state.season));
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
            ${LOC_LOGOS[p.locKey]
              ? `<span class="result-card__location result-card__location--logo">
              <img src="${imgBase}${LOC_LOGOS[p.locKey]}" alt="${p.loc}" class="result-card__location-logo" loading="lazy" />
            </span>`
              : `<span class="result-card__location">
              <span class="result-card__location-icon" aria-hidden="true">${ICONS.loc[p.locKey]}</span>
              <span class="result-card__location-text">${p.loc}</span>
            </span>`}
          </header>
          <h4 class="result-card__title">${p.jp}</h4>
          <p class="result-card__en">${p.en}</p>
          <ul class="result-card__feats" aria-label="プログラムの特徴">
            <li class="feat feat--format" aria-label="${formatText[p.formatKey]}">
              <span class="feat__icon" aria-hidden="true">${ICONS.format[p.formatKey]}</span>
              <span>${formatText[p.formatKey]}</span>
            </li>
            <li class="feat feat--intensity${p.isGroup ? '' : ' feat--intensity-' + p.tag}" aria-label="${p.isGroup ? p.planCount + 'プランから選択' : intensityText[p.tag]}">
              <span class="feat__icon" aria-hidden="true">${ICONS.intensity[p.tag]}</span>
              <span>${p.isGroup ? p.planCount + 'プランから選択' : intensityText[p.tag]}</span>
            </li>
            <li class="feat feat--native" aria-label="ネイティブ講師">
              <span class="feat__icon" aria-hidden="true">${ICONS.native}</span>
              <span>ネイティブ講師</span>
            </li>
          </ul>
          <div class="result-card__foot">
            <a href="${coursesHref}#course-${id}" class="result-card__link" data-program="${id}">詳細を見る →</a>
          </div>
        </article>
      `).join('');
    }

    root.addEventListener('click', (e) => {
      const choice = e.target.closest('.choice');
      if (choice) {
        const key = choice.dataset.key;
        // Corporate card is informational only — its LINE pill is a real link.
        // Ignore clicks on the card itself (don't advance the wizard).
        if (key === 'corporate') return;
        const step = Number(choice.closest('.finder__step').dataset.step);
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

    /* ---------- Whole result card is clickable ---------- */
    // Forward a click anywhere on the card to its "詳細を見る" link, so the
    // entire card acts as one big button. Delegated on the (persistent)
    // results container so it survives re-renders. Clicks on the link itself
    // (or a future inner control) fall through to their own handling.
    if ($results) {
      $results.addEventListener('click', (e) => {
        const card = e.target.closest('.result-card');
        if (!card || e.target.closest('a, button')) return;
        // ignore text selections / drags
        if (window.getSelection && String(window.getSelection())) return;
        card.querySelector('.result-card__link')?.click();
      });
    }

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
        'niseko-basic':       { weeklyRate: 84000,  maxWeeks: 8,  defaultWeeks: 2, perWeekPrice: '¥84,000',  tags: ['通学制','本格型','ネイティブ講師'],            content: 'basic',     plan: 'basic'   },
        'niseko-popular':     { weeklyRate: 80000,  maxWeeks: 12, defaultWeeks: 4, perWeekPrice: '¥80,000',  tags: ['通学制','本格型','ネイティブ講師','4週間'],   content: 'popular',   plan: 'popular' },
        'niseko-intensive':   { weeklyRate: 78000,  maxWeeks: 16, defaultWeeks: 8, perWeekPrice: '¥78,000',  tags: ['通学制','集中型','ネイティブ講師','8週間'],   content: 'intensive', plan: 'focus'   },
        'niseko-whv':         { weeklyRate: 99000,  maxWeeks: 1,  defaultWeeks: 1, perWeekPrice: '¥99,000', tags: ['通学制','ネイティブ講師','バイリンガルサポート'], content: 'whv', note: 'こちらは1週間のコースです。2週間以上の他プランと組み合わせる場合、この1週間分の料金は ¥65,000 となります。' },
        'nozawa-basic':       { weeklyRate: 79000,  maxWeeks: 8,  defaultWeeks: 2, perWeekPrice: '¥79,000',  tags: ['通学制','本格型','ネイティブ講師'],            content: 'basic',     plan: 'basic',   creator: NOZAWA_CREATOR },
        'nozawa-popular':     { weeklyRate: 75000,  maxWeeks: 12, defaultWeeks: 4, perWeekPrice: '¥75,000',  tags: ['通学制','本格型','ネイティブ講師','4週間'],   content: 'popular',   plan: 'popular', creator: NOZAWA_CREATOR },
        'nozawa-intensive':   { weeklyRate: 73000,  maxWeeks: 16, defaultWeeks: 8, perWeekPrice: '¥73,000',  tags: ['通学制','集中型','ネイティブ講師','8週間'],   content: 'intensive', plan: 'focus',   creator: NOZAWA_CREATOR },
        'tokyo-school':       { weeklyRate: 12000,  maxWeeks: 24, defaultWeeks: 4, perWeekPrice: '¥12,000',  tags: ['通学制','気軽型','ネイティブ講師'],            content: 'casual'     },
        'tokyo-seminars':     { weeklyRate: 12000,  maxWeeks: 8,  defaultWeeks: 1, perWeekPrice: '¥12,000',  tags: ['通学制','気軽型','単発'],                      content: 'seminar', noAccommodation: true },
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
        seminar: [
          { label: 'セッション',   value: '90 分' },
          { label: '形式',          value: '対面' },
          { label: 'ネイティブ講師', value: 'あり' },
          { label: '少人数',       value: '最大 8 名' },
          { label: 'テーマ',       value: '毎月変更' },
          { label: '質疑応答',     value: 'あり' },
        ],
        // Tokyo-only weekly content (distinct from Niseko/Nozawa's shared variants).
        tokyoBasic: [
          { label: '授業',          value: '計 16 コマ' },
          { label: 'マンツーマン', value: 'なし' },
          { label: '発音矯正',     value: '月 1 回' },
          { label: 'アクティビティ', value: '計 2 コマ' },
          { label: 'フリー英会話', value: '1 時間 / 日' },
          { label: 'カウンセリング', value: '月 1 回' },
        ],
        tokyoPopular: [
          { label: '授業',          value: '計 16 コマ' },
          { label: 'マンツーマン', value: '月 1 回' },
          { label: '発音矯正',     value: '月 1 回' },
          { label: 'アクティビティ', value: '計 4 コマ' },
          { label: 'フリー英会話', value: '1 時間 / 日' },
          { label: 'カウンセリング', value: '月 1 回' },
        ],
        tokyoFocus: [
          { label: '授業',          value: '計 16 コマ' },
          { label: 'マンツーマン', value: '月 2 回' },
          { label: '発音矯正',     value: '月 1 回' },
          { label: 'アクティビティ', value: '計 6 コマ' },
          { label: 'フリー英会話', value: '1 時間 / 日' },
          { label: 'カウンセリング', value: '月 2 回' },
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
        photo: '../assets/img/creator-john.jpg',
      };

      const escapeHtml = (s) => String(s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

      // Tuition lookup tables (¥, ex-tax) sourced from the Niseko Study Abroad
      // Pricing sheet. Keyed by plan → duration (weeks). Tuition is NON-linear,
      // so plan courses look it up here instead of weeklyRate × weeks.
      // Enrollment ¥20,000, 10% tax, and accommodation (per week) are applied on top.
      const PRICING_TABLE = {
        basic:   {1:99000,2:159000,3:219000,4:269000,5:334000,6:399000,7:464000,8:529000,9:594000,10:659000,11:724000,12:789000,13:854000,14:919000,16:1049000,24:1569000},
        popular: {1:119000,2:199000,3:289000,4:349000,5:424000,6:499000,7:574000,8:649000,9:724000,10:799000,11:874000,12:949000,13:1024000,14:1099000,16:1249000,24:1849000},
        focus:   {1:159000,2:279000,3:349000,4:399000,5:484000,6:569000,7:654000,8:739000,9:824000,10:909000,11:994000,12:1079000,13:1164000,14:1249000,16:1419000,24:2099000},
      };

      // Combined-card plan data lives in LOCATION_GROUPS (outer scope).

      function renderCourseProduct(id, p, x) {
        const content = CONTENT_VARIANTS[x.content] || CONTENT_VARIANTS.popular;
        const features = x.features || DEFAULT_FEATURES;
        const creator = x.creator || DEFAULT_CREATOR;
        const sliderId = `calc-${id}`;
        const accId = `acc-${id}`;
        // Quote breakdown (live-updated by the price calculator JS below).
        // Default accommodation = ロッジ（シェア）(+¥0).
        const ENROLLMENT_FEE = 20000;
        const LINE_URL = 'https://page.line.me/704erohc?oat_content=url&openQrModal=true';
        const jpy = (n) => '¥' + n.toLocaleString('ja-JP');
        // Plan courses use the sheet lookup table; others fall back to weeklyRate × weeks.
        const planTable = x.plan ? PRICING_TABLE[x.plan] : null;
        const tuitionFor = (weeks) => {
          if (!planTable) return x.weeklyRate * weeks;
          if (planTable[weeks] != null) return planTable[weeks];
          const ks = Object.keys(planTable).map(Number).sort((a, b) => a - b);
          let n = ks[0];
          for (const k of ks) if (Math.abs(k - weeks) < Math.abs(n - weeks)) n = k;
          return planTable[n];
        };
        const qTuition = tuitionFor(x.defaultWeeks);       // 授業料
        const qSubtotal = ENROLLMENT_FEE + qTuition;       // 小計（税抜）, free acc = 0
        const qTax = Math.round(qSubtotal * 0.10);         // 消費税（10%）
        const qTotal = qSubtotal + qTax;                   // お支払い合計
        const accBlock = x.noAccommodation ? '' : `
                <div class="course-product__calc-row course-product__calc-row--acc">
                  <span class="course-product__acc-label">宿泊タイプ</span>
                  <div class="acc-cards" data-calc-acc role="radiogroup" aria-label="宿泊タイプ">
                    <label class="acc-card">
                      <input type="radio" name="${accId}" value="free" data-rate="0" data-acc-name="ロッジ（シェア）" checked>
                      <span class="acc-card__icon" aria-hidden="true">🛏️</span>
                      <span class="acc-card__name"><span class="acc-card__free">無料！</span><br>ロッジ（シェア）</span>
                      <span class="acc-card__en">Lodge Share</span>
                    </label>
                    <label class="acc-card">
                      <input type="radio" name="${accId}" value="lodge-private" data-rate="9000" data-acc-name="ロッジ（個室）">
                      <span class="acc-card__icon" aria-hidden="true">🚪</span>
                      <span class="acc-card__name">ロッジ<br>（個室）</span>
                      <span class="acc-card__en">Lodge Private</span>
                    </label>
                    <label class="acc-card">
                      <input type="radio" name="${accId}" value="apt-private" data-rate="2000" data-acc-name="アパート（個室）">
                      <span class="acc-card__icon" aria-hidden="true">🏢</span>
                      <span class="acc-card__name">アパート<br>（個室）</span>
                      <span class="acc-card__en">Apartment Private</span>
                    </label>
                    <label class="acc-card">
                      <input type="radio" name="${accId}" value="apt-share" data-rate="3000" data-acc-name="アパート（シェア）">
                      <span class="acc-card__icon" aria-hidden="true">🛋️</span>
                      <span class="acc-card__name">アパート<br>（シェア）</span>
                      <span class="acc-card__en">Apartment Share</span>
                    </label>
                  </div>
                </div>`;
        // Location-based heritage crest shown as a top-right brand mark.
        const CRESTS = {
          niseko: { src: '../assets/img/niseko-ryugaku-old-logo.png', alt: 'Niseko Ryugaku' },
          nozawa: { src: '../assets/img/nozawa-logo.png?v=2',         alt: 'Nozawa International Academy' },
          tokyo:  { src: '../assets/img/tokyo-logo.png',              alt: 'Tokyo International Academy' },
        };
        const crest = CRESTS[p.locKey];
        const brandMark = crest
          ? `<img src="${crest.src}" alt="${crest.alt}" class="course-product__brand-mark" loading="lazy" />`
          : '';
        // Optional diagonal corner ribbon (e.g. launch date).
        const ribbon = x.ribbon
          ? `<span class="course-product__ribbon">${escapeHtml(x.ribbon)}</span>`
          : '';
        // Plan name shown in the 授業料 quote line (a span so the plan-switcher can update it).
        const quoteName = x.quoteName || p.jp;
        // Optional plan dropdown (combined location cards). Each option carries
        // its own pricing/content data so the switcher needs no extra lookup.
        const planSelectHtml = x.planOptions ? `
                <div class="course-product__calc-row course-product__calc-row--plan">
                  <label for="plan-${id}">プラン</label>
                  <select id="plan-${id}" class="course-product__plan-select" data-plan-select aria-label="プランを選択">
                    ${x.planOptions.map((pl, i) => {
                      const t = pl.plan ? PRICING_TABLE[pl.plan] : null;
                      return `<option value="${pl.value}"${i === 0 ? ' selected' : ''} data-weekly="${pl.weeklyRate}" data-max="${pl.maxWeeks}" data-default="${pl.defaultWeeks}" data-content="${pl.content}" data-quote-name="${escapeHtml(pl.quoteName)}" data-no-acc="${pl.noAccommodation ? 1 : 0}" data-tuition='${t ? JSON.stringify(t) : ''}'>${escapeHtml(pl.label)}</option>`;
                    }).join('')}
                  </select>
                </div>` : '';
        return `
        <article id="course-${id}" class="course-product course-product--${p.accent}">
          <div class="course-product__body">
            ${ribbon}${brandMark}

            <!-- Header -->
            <header class="course-product__head">
              <h3 class="course-product__title">${escapeHtml(p.jp)}</h3>
              <p class="course-product__en">${escapeHtml(p.en)}</p>
              <ul class="course-product__feats">
                ${x.tags.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
              </ul>
            </header>

            <!-- Price calculator + live quote (side-by-side) -->
            <div class="course-product__grid">
              <div class="course-product__calc" data-calc data-weekly-rate="${x.weeklyRate}" data-unit="${escapeHtml(x.unit || '週間')}" data-tuition='${planTable ? JSON.stringify(planTable) : ''}'>
                <p class="course-product__sub-head">料金シミュレーター</p>
                ${planSelectHtml}
                <div class="course-product__calc-row">
                  <label for="${sliderId}">期間</label>
                  <output for="${sliderId}" data-calc-weeks>${x.defaultWeeks} ${x.unit || '週間'}</output>
                </div>
                <input type="range" id="${sliderId}" min="1" max="${x.maxWeeks}" value="${x.defaultWeeks}" step="1" data-calc-input aria-label="受講期間（${escapeHtml(x.unit || '週間')}）"${x.maxWeeks <= 1 ? ' hidden' : ''}>
                ${x.note ? `<p class="course-product__calc-note">${escapeHtml(x.note)}</p>` : ''}
                ${accBlock}
              </div>

              <div class="course-product__quote" data-quote data-enrollment="${ENROLLMENT_FEE}">
                <div class="course-product__quote-rows">
                  <div class="quote-row">
                    <span class="quote-row__label">入学金</span>
                    <span class="quote-row__val">${jpy(ENROLLMENT_FEE)}</span>
                  </div>
                  <div class="quote-row">
                    <span class="quote-row__label">授業料 - <span data-quote-plan-name>${escapeHtml(quoteName)}</span> <span data-quote-weeks>× ${x.defaultWeeks}${x.unit || '週間'}</span></span>
                    <span class="quote-row__val" data-quote-tuition>${jpy(qTuition)}</span>
                  </div>
                  ${x.noAccommodation ? '' : `
                  <div class="quote-row">
                    <span class="quote-row__label">宿泊費 - <span data-quote-acc-name>ロッジ（シェア）</span> <span data-quote-weeks>× ${x.defaultWeeks}${x.unit || '週間'}</span></span>
                    <span class="quote-row__val" data-quote-acc>¥0</span>
                  </div>`}
                  <div class="quote-row quote-row--subtotal">
                    <span class="quote-row__label">小計（税抜）</span>
                    <span class="quote-row__val" data-quote-subtotal>${jpy(qSubtotal)}</span>
                  </div>
                  <div class="quote-row quote-row--tax">
                    <span class="quote-row__label">消費税（10%）</span>
                    <span class="quote-row__val" data-quote-tax>${jpy(qTax)}</span>
                  </div>
                </div>
                <div class="course-product__quote-total">
                  <span class="quote-total__label">お支払い合計 · <span>Total</span></span>
                  <p class="quote-total__amount">¥<span data-quote-total>${qTotal.toLocaleString('ja-JP')}</span><small>税込</small></p>
                </div>
                <a href="${LINE_URL}" target="_blank" rel="noopener" class="course-product__quote-cta">
                  <img src="../assets/img/line-icon.png" alt="" class="course-product__quote-cta-icon" loading="lazy" /> 公式LINEでお問い合わせ・申し込む
                </a>
              </div>
            </div>

            <!-- Weekly content matrix -->
            <div class="course-product__contents">
              <p class="course-product__sub-head">${escapeHtml(x.contentHeading || 'コース内容（1週間あたり）')}</p>
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
              <span class="course-product__cta-avatar">
                <img src="../assets/img/moeko.jpg" alt="無料カウンセリング担当 Moeko" loading="lazy" />
              </span>
              <div class="course-product__cta-body">
                <p class="course-product__cta-eyebrow">はじめてみませんか?</p>
                <h4 class="course-product__cta-title">無料カウンセリングを予約する</h4>
              </div>
              <a href="../index.html#contact" class="course-product__cta-button">
                予約はこちら
                <span class="course-product__cta-button-arrow" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8 L13 8 M9 4 L13 8 L9 12"/></svg>
                </span>
              </a>
            </div>

          </div>
        </article>`;
      }

      // Combined location cards (ニセコ留学 / 野沢留学 / 東京): each rendered once
      // at its first member's slot, defaulting to its first plan, with a plan
      // dropdown for the rest. The default plan must allow accommodation so the
      // accommodation block exists for plans that do.
      const groupsInserted = new Set();
      detailHost.innerHTML = Object.entries(programs)
        .filter(([id]) => detailExtras[id])  // skip any program without detail config
        .map(([id, p]) => {
          const key = MEMBER_TO_GROUP[id];
          if (key) {
            if (groupsInserted.has(key)) return '';
            groupsInserted.add(key);
            const g = LOCATION_GROUPS[key];
            const def = g.plans[0];
            const groupP = { jp: g.title, en: g.en, loc: g.loc, locKey: g.locKey, accent: g.accent };
            const groupX = {
              weeklyRate: def.weeklyRate, maxWeeks: def.maxWeeks, defaultWeeks: def.defaultWeeks,
              tags: g.tags || ['通学制', 'ネイティブ講師', 'プラン選択可'], content: def.content, plan: def.plan,
              planOptions: g.plans, quoteName: def.quoteName, noAccommodation: def.noAccommodation,
              contentHeading: g.contentHeading, unit: g.unit, ribbon: g.ribbon, features: g.features,
            };
            return renderCourseProduct(key, groupP, groupX);
          }
          return renderCourseProduct(id, p, detailExtras[id]);
        })
        .join('\n');

      // Plan dropdown → re-price the simulator, swap the weekly-content matrix,
      // and show/hide accommodation. Each <option> carries its own data.
      document.querySelectorAll('[data-plan-select]').forEach((sel) => {
        sel.addEventListener('change', () => {
          const card = sel.closest('.course-product');
          const opt = sel.selectedOptions[0];
          if (!card || !opt) return;
          const calc = card.querySelector('[data-calc]');
          const slider = calc.querySelector('[data-calc-input]');
          // Keep the chosen number of weeks when switching plans (clamped to the
          // new plan's max) so the slider doesn't jump to each plan's default.
          const curWeeks = Number(slider.value) || Number(opt.dataset.default);
          const newMax = Number(opt.dataset.max);
          calc.dataset.weeklyRate = opt.dataset.weekly;
          calc.dataset.tuition = opt.dataset.tuition || '';
          slider.max = opt.dataset.max;
          slider.value = String(Math.min(Math.max(curWeeks, 1), newMax));
          const nameEl = card.querySelector('[data-quote-plan-name]');
          if (nameEl) nameEl.textContent = opt.dataset.quoteName;
          const grid = card.querySelector('.course-product__contents-grid');
          const content = CONTENT_VARIANTS[opt.dataset.content] || CONTENT_VARIANTS.popular;
          if (grid) grid.innerHTML = content.map((c) => `<li><strong>${escapeHtml(c.label)}</strong><span>${escapeHtml(c.value)}</span></li>`).join('');
          // Show/hide accommodation (e.g. Tokyo seminars have none).
          const noAcc = opt.dataset.noAcc === '1';
          const accRow = card.querySelector('.course-product__calc-row--acc');
          const accQuote = card.querySelector('[data-quote-acc]');
          const accQuoteRow = accQuote ? accQuote.closest('.quote-row') : null;
          if (accRow) accRow.style.display = noAcc ? 'none' : '';
          if (accQuoteRow) accQuoteRow.style.display = noAcc ? 'none' : '';
          if (noAcc) { const free = card.querySelector('.acc-card input[value="free"]'); if (free) free.checked = true; }
          slider.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });

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
       [data-calc-acc]                  → optional accommodation card group
                                          (each <input type="radio" data-rate="N">
                                           adds N per week when checked)
  */
  document.querySelectorAll('[data-calc]').forEach((calc) => {
    const input = calc.querySelector('[data-calc-input]');
    const weeksOut = calc.querySelector('[data-calc-weeks]');
    const accGroup = calc.querySelector('[data-calc-acc]');
    if (!input || !Number(calc.dataset.weeklyRate || 0)) return;

    const grid = calc.closest('.course-product__grid');
    const quote = grid ? grid.querySelector('[data-quote]') : null;

    const fmt = (n) => n.toLocaleString('ja-JP');
    const yen = (n) => '¥' + fmt(n);
    const setText = (sel, val) => { const el = quote && quote.querySelector(sel); if (el) el.textContent = val; };

    const update = () => {
      // Read pricing fresh each call so the plan switcher (which rewrites these
      // data attributes) takes effect without needing to re-wire the listener.
      const weeklyRate = Number(calc.dataset.weeklyRate || 0);
      const unit = calc.dataset.unit || '週間';
      const tuitionTable = (() => { try { return calc.dataset.tuition ? JSON.parse(calc.dataset.tuition) : null; } catch (e) { return null; } })();
      const validWeeks = tuitionTable ? Object.keys(tuitionTable).map(Number).sort((a, b) => a - b) : null;
      const snapWeeks = (w) => {
        if (!validWeeks || tuitionTable[w] != null) return w;
        let n = validWeeks[0];
        for (const k of validWeeks) if (Math.abs(k - w) < Math.abs(n - w)) n = k;
        return n;
      };

      let weeks = Number(input.value);
      // Plans only sell specific durations — snap the slider to the nearest one.
      if (tuitionTable) { weeks = snapWeeks(weeks); if (Number(input.value) !== weeks) input.value = weeks; }
      const accRadio = accGroup ? accGroup.querySelector('input:checked') : null;
      const accRate = accRadio ? Number(accRadio.dataset.rate || 0) : 0;
      if (weeksOut) weeksOut.value = `${weeks} ${unit}`;

      if (quote) {
        const enrollment = Number(quote.dataset.enrollment || 0);
        const tuition = tuitionTable ? tuitionTable[weeks] : weeklyRate * weeks;
        const accCost = accRate * weeks;
        const subtotal = enrollment + tuition + accCost;
        const tax = Math.round(subtotal * 0.10);
        const total = subtotal + tax;

        setText('[data-quote-tuition]', yen(tuition));
        setText('[data-quote-acc]', yen(accCost));
        setText('[data-quote-subtotal]', yen(subtotal));
        setText('[data-quote-tax]', yen(tax));
        setText('[data-quote-total]', fmt(total));
        if (accRadio) setText('[data-quote-acc-name]', accRadio.dataset.accName || '');
        quote.querySelectorAll('[data-quote-weeks]').forEach((el) => { el.textContent = `× ${weeks}${unit}`; });
      }
    };
    input.addEventListener('input', update);
    if (accGroup) accGroup.addEventListener('change', update);
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

/* ============================================================
   Language selector (Google Translate–powered; JA = source)
   Selecting a language sets the `googtrans` cookie and reloads;
   the hidden Google widget reads that cookie on every page, so the
   choice carries across the whole site. Japanese clears the cookie
   (back to the untranslated original).
   ============================================================ */
(function () {
  var LANGS = [
    { code: 'ja',    name: '日本語',  cc: 'jp' },
    { code: 'ko',    name: '한국어',  cc: 'kr' },
    { code: 'zh-CN', name: '中文',    cc: 'cn' },
    { code: 'es',    name: 'Español', cc: 'es' }
  ];

  function exists(code) {
    return LANGS.some(function (l) { return l.code === code; });
  }
  function byCode(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return LANGS[0];
  }
  function flagImg(cc) {
    return '<img class="lang-flag" src="https://flagcdn.com/' + cc + '.svg" width="22" height="15" alt="" aria-hidden="true" loading="lazy">';
  }
  function readCookie(name) {
    var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : '';
  }
  function currentLang() {
    var c = readCookie('googtrans'); // e.g. "/ja/ko"
    if (c) {
      var t = c.split('/').filter(Boolean).pop();
      if (t && exists(t)) return t;
    }
    return 'ja';
  }
  function setLang(code) {
    var host = location.hostname;
    var kill = '; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'googtrans=' + kill;
    document.cookie = 'googtrans=' + kill + '; domain=' + host;
    var parts = host.split('.');
    if (parts.length > 2) document.cookie = 'googtrans=' + kill + '; domain=.' + parts.slice(-2).join('.');
    if (code && code !== 'ja') {
      var val = '/ja/' + code;
      document.cookie = 'googtrans=' + val + '; path=/';
      document.cookie = 'googtrans=' + val + '; path=/; domain=' + host;
    }
    try { localStorage.setItem('smLang', code); } catch (e) {}
    location.reload();
  }

  /* Hidden Google Translate widget — reads the cookie on load */
  function injectGoogle() {
    if (document.getElementById('google_translate_element')) return;
    var holder = document.createElement('div');
    holder.id = 'google_translate_element';
    holder.className = 'notranslate';
    holder.setAttribute('aria-hidden', 'true');
    document.body.appendChild(holder);
    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement(
        { pageLanguage: 'ja', includedLanguages: 'ja,ko,zh-CN,es', autoDisplay: false },
        'google_translate_element'
      );
    };
    var s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.body.appendChild(s);
  }

  var CARET = '<svg class="lang-switch__caret" viewBox="0 0 12 12" aria-hidden="true">' +
    '<path d="M2 4.5 L6 8.5 L10 4.5" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function makeItem(l, cur) {
    var item = document.createElement('button');
    item.type = 'button';
    item.className = 'lang-switch__item' + (l.code === cur ? ' is-active' : '');
    item.innerHTML = flagImg(l.cc) + '<span>' + l.name + '</span>';
    item.addEventListener('click', function () { setLang(l.code); });
    return item;
  }

  function buildHeader(cur) {
    var c = byCode(cur);
    var wrap = document.createElement('div');
    wrap.className = 'lang-switch lang-switch--header notranslate';
    wrap.setAttribute('translate', 'no');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-switch__btn';
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', '言語を選択 / Select language');
    btn.innerHTML = flagImg(c.cc) + CARET;

    var menu = document.createElement('div');
    menu.className = 'lang-switch__menu';
    menu.setAttribute('role', 'menu');
    LANGS.forEach(function (l) { menu.appendChild(makeItem(l, cur)); });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      wrap.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    return wrap;
  }

  /* Label + flag-pill row — used in the mobile nav drawer and the footer */
  function buildRow(cur, variant) {
    var wrap = document.createElement('div');
    wrap.className = 'lang-switch lang-switch--' + variant + ' notranslate';
    wrap.setAttribute('translate', 'no');
    var label = document.createElement('span');
    label.className = 'lang-switch__label';
    label.textContent = 'Language / 言語';
    var row = document.createElement('div');
    row.className = 'lang-switch__row';
    LANGS.forEach(function (l) { row.appendChild(makeItem(l, cur)); });
    wrap.appendChild(label);
    wrap.appendChild(row);
    return wrap;
  }

  function init() {
    injectGoogle();
    var cur = currentLang();
    var actions = document.querySelector('.site-header__actions');     // desktop: dropdown in header bar
    if (actions) actions.insertBefore(buildHeader(cur), actions.querySelector('.nav-toggle'));
    var nav = document.querySelector('.site-nav');                     // mobile: row inside hamburger drawer
    if (nav) nav.appendChild(buildRow(cur, 'nav'));
    var footer = document.querySelector('.site-footer__brand') || document.querySelector('.site-footer__inner');
    if (footer) footer.appendChild(buildRow(cur, 'footer'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
