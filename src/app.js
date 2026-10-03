/* ==========================================================================
   NILE BITES — design concept interactions
   ========================================================================== */
(function () {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- i18n */
  const L = {
    openNow:   { en: 'OPEN NOW',        ar: 'مفتوح دلوقتي' },
    closed:    { en: 'CLOSED NOW',      ar: 'مغلق دلوقتي' },
    soon:      { en: 'COMING SOON',     ar: 'قريبًا' },
    bites:     { en: 'Bites',           ar: 'بايتس' },
    sauce:     { en: 'Sauce',           ar: 'الصوص' },
    size:      { en: 'Size',            ar: 'الحجم' },
    toppings:  { en: 'Toppings',        ar: 'الإضافات' },
    none:      { en: '—',               ar: '—' },
    added:     { en: 'Added to your cup. Finish the order below.', ar: 'اتضاف على كوبك. كمّل الطلب تحت.' },
    orderAdded:{ en: 'Order added — concept demo, no payment.',    ar: 'اتضاف للطلب — ديمو كونسبت، مفيش دفع.' },
    rated:     { en: 'Thanks! You earned', ar: 'شكرًا! كسبت' },
    points:    { en: 'points',          ar: 'نقطة' },
    copied:    { en: 'Link copied',     ar: 'اتنسخ اللينك' },
   _egp:       { en: 'EGP',             ar: 'ج.م' },
    pickDel:   { en: 'Pick up · Delivery', ar: 'استلام · دليفري' },
    pick:      { en: 'Pick up only',    ar: 'استلام فقط' },
    na:        { en: 'Not open yet',    ar: 'لسه ما افتتحناش' }
  };
  let lang = 'en';
  try { lang = localStorage.getItem('nb-lang') || 'en'; } catch (e) {}
  const t = (k) => (L[k] ? L[k][lang] || L[k].en : k);

  function applyLang(next) {
    lang = next;
    try { localStorage.setItem('nb-lang', lang); } catch (e) {}
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-en]').forEach(el => {
      if (el.children.length !== 0) return;
      const v = el.getAttribute('data-' + lang);
      el.textContent = (v !== null && v !== undefined) ? v : el.getAttribute('data-en');
    });
    $$('[data-en-ph]').forEach(el => el.setAttribute('placeholder', el.getAttribute('data-' + lang + '-ph') || el.getAttribute('data-en-ph') || ''));
    $$('[data-en-title]').forEach(el => el.title = el.getAttribute('data-' + lang + '-title') || el.title);
    $$('.lang__btn').forEach(b => b.classList.toggle('is-active', b.dataset.lang === lang));
    renderBuilder(true);
    if (activeLoc) paintLocation(activeLoc, true);
  }
  $$('[data-lang]').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

  /* ------------------------------------------------------------- preloader */
  const intro = $('#intro');
  let introDone = false;
  function endIntro() {
    if (introDone) return;
    introDone = true;
    intro.classList.add('is-done');
    document.body.classList.remove('is-locked');
    $('#hero').classList.add('is-live');
    setTimeout(maybeConsent, 2000);
    try { sessionStorage.setItem('nb-intro', '1'); } catch (e) {}
    setTimeout(() => { intro.remove(); }, 900);
  }
  (function runIntro() {
    let seen = false;
    try { seen = sessionStorage.getItem('nb-intro') === '1'; } catch (e) {}
    if (reduceMotion || seen) {
      if (intro) { intro.remove(); }
      introDone = true;
      $('#hero').classList.add('is-live');
      return;
    }
    document.body.classList.add('is-locked');
    requestAnimationFrame(() => intro.classList.add('is-run'));
    setTimeout(endIntro, 4300);
    $('#skipIntro').addEventListener('click', endIntro);
    window.addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'Enter') endIntro(); });
    window.addEventListener('click', function once() { endIntro(); window.removeEventListener('click', once); }, { once: true });
  })();

  /* ------------------------------------------------------------------ nav */
  const nav = $('#nav');
  const orderbar = $('#orderbar');
  const wafab = $('#wafab');
  const footer = $('.footer');
  let lastY = -1;
  function onScroll() {
    const y = window.scrollY;
    if (y === lastY) return;
    lastY = y;
    nav.classList.toggle('is-solid', y > 30);
    const showBar = y > window.innerHeight * 0.85;
    const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
    const barOn = showBar && footerTop > window.innerHeight * 0.75;
    orderbar.classList.toggle('is-on', barOn);
    if (wafab) wafab.classList.toggle('is-on', barOn);
    $$('[data-parallax]').forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const k = parseFloat(el.dataset.parallax) || 0.1;
      const off = (r.top + r.height / 2 - window.innerHeight / 2) * -k;
      el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------- mobile menu */
  const burger = $('#burger');
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
  }));

  /* ------------------------------------------------------------- reveal */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal, .progress').forEach(el => io.observe(el));

  /* -------------------------------------------------------------- toast */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2600);
  }

  function writeLS(key, rec) {
    try {
      const all = JSON.parse(localStorage.getItem(key) || '[]');
      all.unshift(rec);
      localStorage.setItem(key, JSON.stringify(all.slice(0, 80)));
    } catch (e) {}
  }

  /* ============================================================ BUILDER */
  const PRICING = {
    kofta:    { base: 145, en: 'Beef Kofta',       ar: 'كفتة لحمة',   color: '#8A4A22', hi: '#C9713A' },
    shawarma: { base: 140, en: 'Chicken Shawarma', ar: 'شاورما فراخ', color: '#C9962F', hi: '#F2CE72' },
    cheese:   { base: 125, en: 'Cheese & Herb',    ar: 'جبنة وأعشاب', color: '#E3C567', hi: '#F7E7A8' },
    shrimp:   { base: 175, en: 'Nile Shrimp',      ar: 'جمبري النيل', color: '#D9613C', hi: '#F09A72' }
  };
  const SAUCES = {
    garlic:    { en: 'Nile Garlic',   ar: 'توم النيل',   price: 0,  color: '#F3E6C4' },
    tahini:    { en: 'Tahini',        ar: 'طحينة',       price: 0,  color: '#D8C39A' },
    shatta:    { en: 'Shatta',        ar: 'شطة',         price: 0,  color: '#C0392B' },
    signature: { en: 'Nile Signature',ar: 'صوص النيل',   price: 10, color: '#E0A72C' }
  };
  const SIZES = { '8': { add: -40 }, '12': { add: 0 }, '18': { add: 45 } };
  const TOPS = {
    herbs:  { en: 'Herbs',        ar: 'أعشاب',       price: 0,  emoji: '🌿' },
    chilli: { en: 'Chilli',       ar: 'شطة',         price: 5,  emoji: '🌶' },
    onion:  { en: 'Crispy Onion', ar: 'بصل مقلي',    price: 10, emoji: '🧅' },
    cheese: { en: 'Extra Cheese', ar: 'جبنة زيادة',  price: 15, emoji: '🧀' },
    lemon:  { en: 'Lemon',        ar: 'ليمون',       price: 0,  emoji: '🍋' }
  };

  const state = { bite: 'kofta', sauce: 'garlic', size: '12', tops: ['onion'] };

  const WA_NUM = '20650000000';
  function waHref() {
    const msg = lang === 'ar'
      ? 'أهلا نايل بايتس! عايز: ' + state.size + ' بايتس ' + name(PRICING, state.bite) + '، صوص ' + name(SAUCES, state.sauce) + (state.tops.length ? '، إضافات: ' + state.tops.map(k => name(TOPS, k)).join('، ') : '') + '. حوالي ' + totalPrice() + ' ج.م'
      : 'Hi Nile Bites! I want: ' + state.size + ' ' + name(PRICING, state.bite) + ' bites, ' + name(SAUCES, state.sauce) + ' sauce' + (state.tops.length ? ', tops: ' + state.tops.map(k => name(TOPS, k)).join(', ') : '') + '. ~' + totalPrice() + ' EGP';
    return 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(msg);
  }
  function updateWa() { $$('.js-wa').forEach(a => a.setAttribute('href', waHref())); }

  function totalPrice() {
    let p = PRICING[state.bite].base + SIZES[state.size].add + SAUCES[state.sauce].price;
    state.tops.forEach(k => { p += TOPS[k].price; });
    return Math.max(0, p);
  }
  const name = (obj, k) => obj[k] ? (obj[k][lang] || obj[k].en) : k;

  function renderBuilder(silent) {
    const price = totalPrice();

    /* --- svg cup --- */
    const bLayer = $('#biteLayer'), tLayer = $('#topLayer');
    if (bLayer) {
      const count = parseInt(state.size, 10);
      const col = PRICING[state.bite];
      let s = '';
      const rows = count <= 8 ? 3 : (count <= 12 ? 4 : 5);
      let n = 0;
      for (let r = 0; r < rows && n < count; r++) {
        const perRow = Math.min(Math.ceil((count - n) / (rows - r)), 5);
        const y = 296 - r * 30;
        const spread = 46 + r * 3;
        for (let c = 0; c < perRow && n < count; c++) {
          const x = 130 + (c - (perRow - 1) / 2) * (spread * 2 / Math.max(perRow, 1));
          s += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y + '" rx="21" ry="15" fill="' + col.color + '" stroke="' + col.hi + '" stroke-width="2"/>';
          s += '<path d="M' + (x - 14).toFixed(1) + ',' + (y - 3) + ' q7,-8 14,-2 q7,-6 14,2" fill="none" stroke="' + col.hi + '" stroke-width="2" stroke-linecap="round" opacity=".85"/>';
          n++;
        }
      }
      bLayer.innerHTML = s;
      $('#sauceFill').setAttribute('fill', SAUCES[state.sauce].color);
      let tp = '';
      const tops = state.tops.slice(0, 5);
      tops.forEach((k, i) => {
        const x = 92 + i * 20 + (i % 2 ? 6 : 0);
        tp += '<text x="' + x + '" y="' + (232 - (i % 2) * 12) + '" font-size="20" text-anchor="middle">' + TOPS[k].emoji + '</text>';
      });
      tLayer.innerHTML = tp;
    }

    /* --- preview list --- */
    const list = $('#previewList');
    if (list) {
      const topsTxt = state.tops.length ? state.tops.map(k => name(TOPS, k)).join(' · ') : t('none');
      list.innerHTML =
        '<li><span>' + t('bites') + '</span><b>' + name(PRICING, state.bite) + '</b></li>' +
        '<li><span>' + t('size') + '</span><b>' + state.size + ' ' + t('bites') + '</b></li>' +
        '<li><span>' + t('sauce') + '</span><b>' + name(SAUCES, state.sauce) + '</b></li>' +
        '<li><span>' + t('toppings') + '</span><b>' + topsTxt + '</b></li>';
    }

    /* --- prices --- */
    const pp = $('#previewPrice'), sp = $('#summaryPrice'), ob = $('#orderbarPrice');
    if (pp) pp.textContent = price;
    if (sp) {
      sp.textContent = price;
      if (!silent) { sp.parentElement.classList.remove('bump'); void sp.parentElement.offsetWidth; sp.parentElement.classList.add('bump'); }
    }
    if (ob) ob.textContent = price + ' ' + t('egp');

    /* --- summary line --- */
    const line = $('#summaryLine');
    if (line) {
      const bits = [state.size + ' ' + t('bites'), name(SAUCES, state.sauce)];
      if (state.tops.length) bits.push(state.tops.map(k => name(TOPS, k)).join(', '));
      line.textContent = name(PRICING, state.bite) + ' · ' + bits.join(' · ');
    }

    updateWa();
    syncCup();

    /* --- chips state --- */
    $$('.chips[data-group]').forEach(group => {
      const g = group.dataset.group;
      $$('.chip', group).forEach(c => {
        const on = g === 'top' ? state.tops.indexOf(c.dataset.val) > -1 : state[g] === c.dataset.val;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', String(on));
      });
    });
  }

  $$('.chips[data-group]').forEach(group => {
    group.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      const g = group.dataset.group, v = chip.dataset.val;
      if (g === 'top') {
        const i = state.tops.indexOf(v);
        if (i > -1) state.tops.splice(i, 1); else state.tops.push(v);
      } else {
        state[g] = v;
      }
      renderBuilder(false);
    });
  });

  /* menu filters */
  $$('.filters .chip').forEach(ch => ch.addEventListener('click', () => {
    $$('.filters .chip').forEach(c => c.classList.toggle('is-on', c === ch));
    const f = ch.dataset.filter;
    $$('.bites__grid .bite').forEach(card => {
      const tags = (card.dataset.tags || '').split(' ').filter(Boolean);
      card.classList.toggle('is-hidden', !(f === 'all' || tags.indexOf(f) > -1));
    });
  }));

  /* "TRY IT" from menu cards */
  $$('.js-try').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.bite');
      const key = card.dataset.bite;
      if (key === 'shawarma' || key === 'kofta' || key === 'cheese' || key === 'shrimp') state.bite = key;
      if (key === 'shatta') { state.bite = 'kofta'; state.sauce = 'shatta'; }
      renderBuilder(false);
      toast(t('added'));
      document.getElementById('builder').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  $('#addToOrder').addEventListener('click', () => openCheckout(null));

  /* ============================================================ LOCATIONS */
  const LOCATIONS = [
    { id:'hurghada', en:'HURGHADA',        ar:'الغردقة',      addrEn:'Sheraton Road, El Dahar', addrAr:'شارع الشيراتون، الدهار', x:505, y:352, live:true,  status:'openNow', hours:'10:00 — 02:00', phone:'+20 65 000 0000', tel:'+20650000000', service:'pickDel', map:'https://maps.google.com/?q=Sheraton+Road+Hurghada' },
    { id:'cairo',    en:'CAIRO',           ar:'القاهرة',      addrEn:'Zamalek — opening 2027',  addrAr:'الزمالك — افتتاح ٢٠٢٧',  x:322, y:150, live:false, status:'soon',    hours:'—',               phone:'—',               tel:'',              service:'na',      map:'https://maps.google.com/?q=Zamalek+Cairo' },
    { id:'alex',     en:'ALEXANDRIA',      ar:'الإسكندرية',   addrEn:'Corniche — planned',      addrAr:'الكورنيش — مخطط',        x:268, y:104, live:false, status:'soon',    hours:'—',               phone:'—',               tel:'',              service:'na',      map:'https://maps.google.com/?q=Alexandria+Corniche' },
    { id:'sharm',    en:'SHARM EL SHEIKH', ar:'شرم الشيخ',    addrEn:'Naama Bay — planned',     addrAr:'نعمة باي — مخطط',        x:466, y:268, live:false, status:'soon',    hours:'—',               phone:'—',               tel:'',              service:'na',      map:'https://maps.google.com/?q=Naama+Bay+Sharm+El+Sheikh' },
    { id:'marsa',    en:'MARSA ALAM',      ar:'مرسى علم',     addrEn:'Marina — planned',        addrAr:'المارينا — مخطط',        x:521, y:452, live:false, status:'soon',    hours:'—',               phone:'—',               tel:'',              service:'na',      map:'https://maps.google.com/?q=Marsa+Alam' },
    { id:'luxor',    en:'LUXOR',           ar:'الأقصر',       addrEn:'Corniche — planned',      addrAr:'الكورنيش — مخطط',        x:356, y:396, live:false, status:'soon',    hours:'—',               phone:'—',               tel:'',              service:'na',      map:'https://maps.google.com/?q=Luxor' }
  ];
  let activeLoc = LOCATIONS[0];

  (function buildPins() {
    const g = $('#pins');
    if (!g) return;
    g.innerHTML = LOCATIONS.map(l => (
      '<g class="pin' + (l.live ? ' is-live is-active' : '') + '" data-id="' + l.id + '" role="button" tabindex="0" aria-label="' + l.en + '">' +
        '<circle class="hit" cx="' + l.x + '" cy="' + l.y + '" r="26"/>' +
        '<circle class="ring" cx="' + l.x + '" cy="' + l.y + '" r="11"/>' +
        '<circle class="core" cx="' + l.x + '" cy="' + l.y + '" r="' + (l.live ? 9 : 6.5) + '"/>' +
        '<text x="' + (l.x + (l.x > 420 ? -18 : 18)) + '" y="' + (l.y + 5) + '" text-anchor="' + (l.x > 420 ? 'end' : 'start') + '">' + l.en + '</text>' +
      '</g>'
    )).join('');
    $$('.pin', g).forEach(p => {
      const go = () => {
        const loc = LOCATIONS.find(x => x.id === p.dataset.id);
        if (!loc) return;
        activeLoc = loc;
        $$('.pin', g).forEach(x => x.classList.remove('is-active'));
        p.classList.add('is-active');
        paintLocation(loc);
      };
      p.addEventListener('click', go);
      p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
  })();

  function isOpenNow(l) {
    if (!l.live) return false;
    const h = new Date().getHours();
    return h >= 10 || h < 2;
  }
  function paintLocation(l, silent) {
    $('#locCity').textContent = lang === 'ar' ? l.ar : l.en;
    $('#locAddr').textContent = lang === 'ar' ? l.addrAr : l.addrEn;
    const st = $('#locStatus');
    const open = isOpenNow(l);
    const key = !l.live ? 'soon' : (open ? 'openNow' : 'closed');
    st.className = 'status' + (key === 'openNow' ? '' : (key === 'soon' ? ' is-soon' : ' is-closed'));
    st.innerHTML = '<span class="pulse"></span><b>' + t(key) + '</b>' + (l.hours !== '—' ? ' <i>' + l.hours + '</i>' : '');
    $('#locPhone').textContent = l.phone;
    const svc = $('#locService');
    svc.textContent = t(l.service);
    svc.removeAttribute('data-en'); svc.removeAttribute('data-ar');
    $('#locMap').href = l.map;
    $('#locCall').href = l.tel ? 'tel:' + l.tel : '#';
    $('#locCall').style.opacity = l.tel ? '1' : '.38';
    $('#locPartners').hidden = !l.live;
    if (!silent) {
      const card = $('#locCard');
      card.animate(
        [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
        { duration: reduceMotion ? 1 : 420, easing: 'cubic-bezier(.16,1,.3,1)' }
      );
    }
  }
  paintLocation(activeLoc, true);

  /* ============================================================== QR CODE */
  function buildQr(svg) {
    if (!svg) return;
    const N = 25, cell = 100 / N;
    let seed = 20260928;
    const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    const grid = [];
    for (let y = 0; y < N; y++) {
      grid[y] = [];
      for (let x = 0; x < N; x++) grid[y][x] = rnd() > 0.52 ? 1 : 0;
    }
    const finder = (ox, oy) => {
      for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
        const edge = (x === 0 || x === 6 || y === 0 || y === 6);
        const core = (x >= 2 && x <= 4 && y >= 2 && y <= 4);
        grid[oy + y][ox + x] = (edge || core) ? 1 : 0;
      }
      for (let i = -1; i < 8; i++) {
        [[ox + i, oy - 1], [ox + i, oy + 7], [ox - 1, oy + i], [ox + 7, oy + i]].forEach(([x, y]) => {
          if (grid[y] && grid[y][x] !== undefined) grid[y][x] = 0;
        });
      }
    };
    finder(0, 0); finder(N - 7, 0); finder(0, N - 7);
    let out = '';
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      if (grid[y][x]) out += '<rect x="' + (x * cell).toFixed(2) + '" y="' + (y * cell).toFixed(2) + '" width="' + cell.toFixed(2) + '" height="' + cell.toFixed(2) + '" rx="0.6"/>';
    }
    svg.innerHTML = out;
  }
  buildQr($('#qrSvg'));

  /* ================================================================ STARS */
  (function stars() {
    const wrap = $('#stars');
    if (!wrap) return;
    const btns = $$('button', wrap);
    const out = $('#qrPoints');
    btns.forEach((b, i) => {
      b.addEventListener('mouseenter', () => btns.forEach((x, j) => x.classList.toggle('on', j <= i)));
      b.addEventListener('click', () => {
        btns.forEach((x, j) => x.classList.toggle('on', j <= i));
        writeLS('nb-scans', { stars: i + 1, sku: 'chicken shawarma', ts: Date.now() });
        apiPost('/api/scan', { sku: 'shawarma', stars: i + 1, device: 'concept', ref: 'utm_source=concept' }).catch(() => {});
        out.textContent = t('rated') + ' ' + ((i + 1) * 10) + ' ' + t('points');
        toast('★ ' + (i + 1) + '/5 — ' + t('rated') + ' ' + ((i + 1) * 10) + ' ' + t('points'));
      });
    });
    wrap.addEventListener('mouseleave', () => {
      const on = btns.filter(x => x.classList.contains('on')).length;
      if (!on) btns.forEach(x => x.classList.remove('on'));
    });
  })();

  /* =========================================================== FR FORM */
  const frForm = $('#frForm');
  frForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = frForm.name.value.trim(), city = frForm.city.value.trim(), email = frForm.email.value.trim();
    if (!name || !city || !/.+@.+\..+/.test(email)) {
      toast(lang === 'ar' ? 'كمّل البيانات من فضلك' : 'Please complete the required fields');
      frForm.reportValidity();
      return;
    }
    $('#frOk').hidden = false;
    writeLS('nb-leads', { name: name, city: city, email: email, range: frForm.range.value, ts: Date.now() });
    apiPost('/api/lead', { name: name, city: city, email: email, budget: frForm.range.value, message: frForm.msg.value }).catch(() => {});
    frForm.reset();
    toast(lang === 'ar' ? 'استلمنا طلبك' : 'Request received');
  });

  /* ========================================================= FRANCHISE DECK */
  const DECK_PDF = 'data:application/pdf;base64,@@DECK_B64@@';
  $('#deckForm').addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#deckForm').email.value.trim();
    if (!/.+@.+\..+/.test(em)) {
      toast(lang === 'ar' ? 'اكتب بريد شغل صحيح' : 'Enter a valid work email');
      $('#deckForm').reportValidity();
      return;
    }
    writeLS('nb-deck', { email: em, ts: Date.now() });
    apiPost('/api/deck', { email: em }).catch(() => {});
    const link = $('#deckLink');
    link.hidden = false;
    link.href = DECK_PDF;
    toast(lang === 'ar' ? 'الديك جاهز — حمّله من اللينك تحت' : 'Deck ready — download link below');
    $('#deckForm').reset();
  });

  /* ========================================================= REFERRAL */
  $('#copyRef').addEventListener('click', async () => {
    const input = $('#refLink');
    input.value = 'nilebites.com/r/' + (lang === 'ar' ? 'صاحبك' : 'your-name');
    try { await navigator.clipboard.writeText(input.value); } catch (e) { input.select(); }
    writeLS('nb-ref', { ts: Date.now() });
    $('#refOk').hidden = false;
    toast(t('copied'));
    setTimeout(() => { $('#refOk').hidden = true; }, 2600);
  });

  /* ============================================================ FEED */
  $('#feedNext').addEventListener('click', () => {
    const rail = $('#feedRail');
    rail.scrollBy({ left: (document.documentElement.dir === 'rtl' ? -1 : 1) * rail.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ================================================== HERO parallax tilt */
  const heroImg = $('.hero__img');
  if (heroImg && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
    $('#hero').addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5), y = (e.clientY / window.innerHeight - 0.5);
      heroImg.style.transform = 'scale(1.08) translate3d(' + (x * -18).toFixed(1) + 'px,' + (y * -14).toFixed(1) + 'px,0)';
    });
    $('#hero').addEventListener('mouseleave', () => { heroImg.style.transform = ''; });
  }

  /* ==================================================== smooth anchors */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const off = id === '#builder' ? 10 : 70;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ==================================================== LIVE API BRIDGE */
  const API_BASE = (function () {
    try { return localStorage.getItem('nb-api') || 'http://localhost:3000'; } catch (e) { return 'http://localhost:3000'; }
  })();
  function apiPost(path, body) {
    return fetch(API_BASE + path, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    }).then(r => { if (!r.ok) throw new Error('api ' + r.status); return r.json(); });
  }

  /* ==================================================== P1: CHECKOUT */
  const CO = { loc: 'hurghada', mode: 'pickup', pay: 'card', qty: 1, promo: 0 };
  const coEl = $('#checkout');
  function coSetStep(n) {
    CO.step = n;
    ['#coS1', '#coS2', '#coS3', '#coOk'].forEach((id, i) => { $(id).hidden = (i + 1 !== n); });
    $$('#coSteps b').forEach(b => {
      const sN = parseInt(b.dataset.s, 10);
      b.classList.toggle('is-on', sN === n);
      b.classList.toggle('is-done', sN < n);
    });
  }
  function coMoney() {
    const sub = totalPrice() * CO.qty;
    const del = CO.mode === 'delivery' ? (sub >= 300 ? 0 : 20) : 0; // robot pilot: free
    const disc = Math.round(sub * CO.promo);
    return { sub: sub, del: del, disc: disc, total: Math.max(0, sub + del - disc) };
  }
  function renderCo() {
    const m = coMoney();
    $('#coItems').innerHTML =
      '<div class="co__line"><span>' + name(PRICING, state.bite) + ' · ' + state.size + ' ' + t('bites') + '</span><b>' + name(SAUCES, state.sauce) + '</b></div>' +
      '<div class="co__line"><span>' + t('toppings') + '</span><b>' + (state.tops.length ? state.tops.map(k => name(TOPS, k)).join(', ') : t('none')) + '</b></div>' +
      '<div class="co__line"><span>' + t('egp') + ' / cup</span><b>' + totalPrice() + '</b></div>';
    $('#qVal').textContent = CO.qty;
    $('#coTotals').innerHTML =
      '<div class="co__line"><span>' + CO.qty + ' × ' + totalPrice() + '</span><b>' + m.sub + ' EGP</b></div>' +
      (CO.mode === 'delivery' ? '<div class="co__line"><span>' + (lang === 'ar' ? 'Delivery' : lang === 'ru' ? 'Доставка' : 'Delivery') + '</span><b>' + (m.del ? m.del + ' EGP' : (lang === 'ru' ? 'бесплатно' : 'FREE')) + '</b></div>' : '') +
      (CO.promo ? '<div class="co__line"><span>NILE10</span><b>−' + m.disc + ' EGP</b></div>' : '');
    $('#coTotal').innerHTML = m.total + ' <i style="font-family:var(--body);font-size:12px;letter-spacing:.14em">EGP</i>';
  }
  function openCheckout(modePreset) {
    if (modePreset) {
      CO.mode = modePreset;
      $$('.co__opts[data-co="mode"] .co__opt').forEach(o => {
        const on = o.querySelector('input').value === modePreset;
        o.querySelector('input').checked = on; o.classList.toggle('is-on', on);
      });
    }
    coSetStep(1); renderCo();
    coEl.classList.add('is-on');
    document.body.style.overflow = 'hidden';
  }
  function closeCheckout() { coEl.classList.remove('is-on'); document.body.style.overflow = ''; }
  $$('#checkout [data-close]').forEach(x => x.addEventListener('click', closeCheckout));
  $$('.modal [data-close]').forEach(x => x.addEventListener('click', () => x.closest('.modal').classList.remove('is-on')));
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') $$('.modal.is-on').forEach(m => m.classList.remove('is-on'));
  });
  $$('.co__opts').forEach(g => g.addEventListener('change', e => {
    const inp = e.target;
    if (!inp.checked) return;
    $$('.co__opt', g).forEach(o => o.classList.toggle('is-on', o.contains(inp)));
    CO[g.dataset.co] = inp.value;
    renderCo();
  }));
  $('#coNext1').addEventListener('click', () => { coSetStep(2); renderCo(); });
  $('#coBack2').addEventListener('click', () => coSetStep(1));
  $('#coNext2').addEventListener('click', () => { coSetStep(3); renderCo(); });
  $('#coBack3').addEventListener('click', () => coSetStep(2));
  $('#qMinus').addEventListener('click', () => { CO.qty = Math.max(1, CO.qty - 1); renderCo(); });
  $('#qPlus').addEventListener('click', () => { CO.qty = Math.min(12, CO.qty + 1); renderCo(); });
  $('#coPromo').addEventListener('change', e => {
    const v = e.target.value.trim().toUpperCase();
    if (v === 'NILE10') { CO.promo = 0.1; toast(lang === 'ar' ? 'خصم ١٠٪' : lang === 'ru' ? 'Скидка 10%' : 'NILE10 applied −10%'); }
    else if (v) { CO.promo = 0; toast(lang === 'ar' ? 'الكود مش شغال' : lang === 'ru' ? 'Код не подошёл' : 'Code not valid'); }
    else CO.promo = 0;
    renderCo();
  });
  $('#coDeliver').addEventListener('click', e => { e.preventDefault(); openCheckout('delivery'); });
  $('#coPay').addEventListener('click', () => {
    const nm = $('#coName').value.trim(), ph = $('#coPhone').value.replace(/\D/g, '');
    if (!nm || ph.length < 8) {
      toast(lang === 'ar' ? 'اسم وتليفون صحيحين من فضلك' : lang === 'ru' ? 'Нужны имя и телефон' : 'Name and a valid phone, please');
      return;
    }
    const m = coMoney();
    apiPost('/api/order', {
      cup: { bite: state.bite, sauce: state.sauce, size: state.size, tops: state.tops, qty: CO.qty },
      mode: CO.mode, promo: CO.promo ? 'NILE10' : undefined, name: nm, phone: $('#coPhone').value.trim(),
      storeSlug: 'hurghada', payMethod: CO.pay, channel: 'site'
    }).then(res => { finishOrder(res.publicId, m, true); })
      .catch(() => { finishOrder('NB-' + (2000 + Math.floor(Math.random() * 7999)), m, false); });
  });
  function finishOrder(id, m, live) {
    $('#coLive').hidden = !live;
    const nm2 = $('#coName').value.trim();
    const rec = { id: id, ts: Date.now(), items: CO.qty + 'x ' + state.bite + '/' + state.size + '/' + state.sauce, total: m.total, channel: 'site', loc: CO.loc, mode: CO.mode, pay: CO.pay, name: nm2, live: live };
    try {
      const all = JSON.parse(localStorage.getItem('nb-orders') || '[]');
      all.unshift(rec); localStorage.setItem('nb-orders', JSON.stringify(all.slice(0, 80)));
    } catch (e) {}
    coSetStep(4);
    $('#coOid').textContent = id;
    $('#coPts').textContent = '+' + (parseInt(state.size, 10) * CO.qty) + ' ' + (lang === 'ar' ? 'نقطة' : lang === 'ru' ? 'ОЧКОВ' : 'POINTS');
    $('#coEta').textContent = CO.mode === 'robot'
      ? (lang === 'ar' ? 'الروفر واصلك في ٢٥ دقيقة — المارينا' : lang === 'ru' ? 'Ровер приедет за 25 мин · Марина' : 'Rover ETA 25 min · Marina promenade')
      : CO.mode === 'delivery'
      ? (lang === 'ar' ? 'التوصيل ٤٥–٦٠ دقيقة · الشيراتون → بابك' : lang === 'ru' ? 'Доставка 45–60 мин · Шератон → ваша дверь' : 'Delivery in 45–60 min · Sheraton Rd → your door')
      : (lang === 'ar' ? 'الاستلام بعد ~٤ دقايق · الشيراتون' : lang === 'ru' ? 'Самовывоз через ~4 мин · Шератон-роуд' : 'Pick-up in ~4 minutes · Sheraton Rd');
    $('#coPayNote').textContent = { card: lang === 'ar' ? 'الدفع بالكارت اتأكد' : lang === 'ru' ? 'Оплата картой подтверждена' : 'Card payment authorised', cash: lang === 'ar' ? 'الدفع كاش عند الاستلام' : lang === 'ru' ? 'Оплата наличными при получении' : 'Cash on pick-up / to courier', wallet: lang === 'ar' ? 'المحفظة: اتخصم المبلغ' : lang === 'ru' ? 'Кошелёк: списание успешно' : 'Wallet charged' }[CO.pay];
    toast(live
      ? (lang === 'ar' ? 'الطلب محفوظ في PostgreSQL' : lang === 'ru' ? 'Заказ в PostgreSQL (live API)' : 'Order saved to PostgreSQL (live API)')
      : (lang === 'ar' ? 'طلبك اتأكد' : lang === 'ru' ? 'Заказ подтверждён' : 'Order confirmed'));
  }
  $('#coTrack').addEventListener('click', () => toast(lang === 'ar' ? 'الطلب في المطبخ — جاهز بعد دقيقتين' : lang === 'ru' ? 'Заказ на кухне — готов через 2 мин' : 'In kitchen — ready in ~2 min'));
  $('#coDone').addEventListener('click', closeCheckout);

  /* ==================================================== P1: CONSENT */
  function maybeConsent() {
    let saved = null;
    try { saved = localStorage.getItem('nb-consent'); } catch (e) {}
    if (!saved) $('#consent').classList.add('is-on');
  }
  function saveConsent(o) {
    try { localStorage.setItem('nb-consent', JSON.stringify(o)); } catch (e) {}
    $('#consent').classList.remove('is-on', 'is-prefs');
    toast(lang === 'ar' ? 'اتحفظت تفضيلاتك' : lang === 'ru' ? 'Настройки сохранены' : 'Preferences saved');
  }
  $('#csAll').addEventListener('click', () => {
    if ($('#consent').classList.contains('is-prefs')) saveConsent({ nec: 1, mkt: $('#pfMkt').checked ? 1 : 0, ana: $('#pfAna').checked ? 1 : 0 });
    else saveConsent({ nec: 1, mkt: 1, ana: 1 });
  });
  $('#csNeed').addEventListener('click', () => saveConsent({ nec: 1, mkt: 0, ana: 0 }));
  $('#csPrefs').addEventListener('click', () => $('#consent').classList.toggle('is-prefs'));
  $('#cookieBtn').addEventListener('click', () => $('#consent').classList.add('is-on', 'is-prefs'));
  $('#consentPriv').addEventListener('click', e => { e.preventDefault(); toast(lang === 'ar' ? 'Privacy: بنخزن حد أدنى بيانات، من غير بيع بيانات' : lang === 'ru' ? 'Privacy: минимум данных, без продажи третьим лицам' : 'Privacy: minimal data, never sold'); });

  /* ==================================================== P1: LOCATION PAGE */
  const LP = $('#locpage');
  function openLocPage(l) {
    if (!l || !l.live) { toast(lang === 'ar' ? 'صفحة الفرع تفتح مع الافتتاح' : lang === 'ru' ? 'Страница точки откроется к запуску' : 'Store page goes live at opening'); return; }
    $('#lpCity').textContent = lang === 'ar' ? l.ar : l.en;
    $('#lpAddr').textContent = (lang === 'ar' ? l.addrAr : l.addrEn) + ', ' + (lang === 'ar' ? l.ar : l.en);
    const H = lang === 'ar'
      ? [['الأحد — الخميس', '١٠:٠٠ — ٠٢:٠٠'], ['الجمعة — السبت', '١٠:٠٠ — ٠٣:٠٠'], ['حالة', t('openNow')]]
      : lang === 'ru'
      ? [['Вс — Чт', '10:00 — 02:00'], ['Пт — Сб', '10:00 — 03:00'], ['Сейчас', t('openNow')]]
      : [['Sun — Thu', '10:00 — 02:00'], ['Fri — Sat', '10:00 — 03:00'], ['Now', t('openNow')]];
    $('#lpHours').innerHTML = H.map(r => '<div><span>' + r[0] + '</span><b>' + r[1] + '</b></div>').join('');
    $('#lpMap').href = l.map; $('#lpCall').href = 'tel:' + l.tel;
    buildQr($('#lpQr'));
    LP.classList.add('is-on');
    document.body.style.overflow = 'hidden';
    try { location.hash = '#/loc/' + l.id; } catch (e) {}
  }
  function closeLocPage() {
    LP.classList.remove('is-on');
    document.body.style.overflow = '';
    if (location.hash.indexOf('#/loc/') === 0) { history.replaceState(null, '', location.pathname + location.search); }
  }
  $('#locBack').addEventListener('click', closeLocPage);
  $('#locPageBtn').addEventListener('click', () => openLocPage(activeLoc));
  $('#lpOrder').addEventListener('click', () => { closeLocPage(); openCheckout(null); });
  window.addEventListener('hashchange', () => {
    const m = location.hash.match(/^#\/loc\/(\w+)/);
    if (m) { const l = LOCATIONS.find(x => x.id === m[1]); if (l && l.live && !LP.classList.contains('is-on')) openLocPage(l); }
  });
  (function initHash() {
    const m = location.hash.match(/^#\/loc\/(\w+)/);
    if (m) { const l = LOCATIONS.find(x => x.id === m[1]); if (l) setTimeout(() => openLocPage(l), 300); }
  })();

  /* ==================================================== NILE CLUB ONBOARDING */
  let joinOtp = null;
  $('#joinSend').addEventListener('click', () => {
    const ph = $('#joinPhone').value.replace(/\D/g, '');
    if (ph.length < 8) { toast(lang === 'ar' ? 'رقم تليفون صحيح من فضلك' : lang === 'ru' ? 'Нужный формат телефона' : 'Enter a valid phone number'); return; }
    joinOtp = String(1000 + Math.floor(Math.random() * 9000));
    $('#joinS1').hidden = true; $('#joinS2').hidden = false;
    toast((lang === 'ar' ? 'كود الديمو: ' : lang === 'ru' ? 'Демо-код: ' : 'Demo code: ') + joinOtp);
  });
  $('#joinVerify').addEventListener('click', () => {
    if ($('#joinOtp').value.trim() !== joinOtp) { toast(lang === 'ar' ? 'الكود غلط' : lang === 'ru' ? 'Код неверный' : 'Wrong code, try again'); return; }
    const id = 'NB-CLUB-' + (1000 + Math.floor(Math.random() * 9000));
    $('#joinS2').hidden = true; $('#joinS3').hidden = false;
    $('#joinId').textContent = id;
    buildQr($('#joinQr'));
    writeLS('nb-club', { id: id, phone: $('#joinPhone').value.trim(), pts: 0, ts: Date.now() });
    toast(lang === 'ar' ? 'انضممت لنادي النيل' : lang === 'ru' ? 'Вы в Nile Club!' : 'You are in Nile Club!');
  });
  $('#joinWallet').addEventListener('click', () => toast(lang === 'ar' ? 'الكارت اتضاف للمحفظة (ديمو)' : lang === 'ru' ? 'Пасс добавлен в кошелёк (демо)' : 'Pass added to wallet (demo)'));

  /* ==================================================== P2: UGC WALL */
  $('#ugcForm').addEventListener('submit', e => {
    e.preventDefault();
    const h = $('#ugcHandle').value.trim();
    if (!h) { toast(lang === 'ar' ? 'اكتب الـhandle بتاعك' : lang === 'ru' ? 'Укажи ник' : 'Add your @handle first'); return; }
    if (!$('#ugcRights').checked) { toast(lang === 'ar' ? 'لازم موافقة الحقوق' : lang === 'ru' ? 'Нужны права на репост' : 'Rights checkbox, please'); return; }
    writeLS('nb-ugc', { handle: h, ts: Date.now() });
    $('#ugcGrid').insertAdjacentHTML('afterbegin',
      '<figure class="ugc__card ugc__card--pending"><span>⏳</span><figcaption><b>' + h.replace(/[<>&]/g, '') + '</b><i>' + (lang === 'ar' ? 'مراجعة' : lang === 'ru' ? 'модерация' : 'moderation') + '</i></figcaption></figure>');
    e.target.reset();
    toast(lang === 'ar' ? 'الكليب في المراجعة — هنعملك DM' : lang === 'ru' ? 'Клип на модерации — напишем в DM' : 'Clip queued for moderation — we will DM you');
  });

  /* ==================================================== P2: CAREERS */
  $$('.job').forEach(j => j.addEventListener('click', () => {
    $('#applyRole').textContent = j.dataset.role;
    $('#applyModal').classList.add('is-on');
  }));
  $('#apSend').addEventListener('click', () => {
    const nm = $('#apName').value.trim(), ph = $('#apPhone').value.replace(/\D/g, '');
    if (!nm || ph.length < 8) { toast(lang === 'ar' ? 'اسم وتليفون من فضلك' : lang === 'ru' ? 'Имя и телефон' : 'Name and phone, please'); return; }
    writeLS('nb-apps', { role: $('#applyRole').textContent, name: nm, phone: $('#apPhone').value, link: $('#apLink').value, ts: Date.now() });
    $('#applyModal').classList.remove('is-on');
    toast(lang === 'ar' ? 'التقديم وصل — HR خلال ٤٨ ساعة' : lang === 'ru' ? 'Заявка у HR — ответ до 48 ч' : 'Application received — HR replies within 48 h');
  });

  /* ==================================================== P2: GIFT CARDS */
  let giftVal = 150;
  $('#giftOpen').addEventListener('click', () => {
    $('#giftS1').hidden = false; $('#giftS2').hidden = true;
    $('#giftModal').classList.add('is-on');
  });
  $$('#giftModal [data-close]').forEach(x => x.addEventListener('click', () => $('#giftModal').classList.remove('is-on')));
  $$('.co__opts[data-co="gift"] .co__opt').forEach(o => o.addEventListener('change', () => {
    const inp = o.querySelector('input');
    if (!inp.checked) return;
    giftVal = parseInt(inp.value, 10);
    $$('.co__opts[data-co="gift"] .co__opt').forEach(x => x.classList.toggle('is-on', x === o));
  }));
  $('#giftSend').addEventListener('click', () => {
    const nm = $('#giftName').value.trim(), ph = $('#giftPhone').value.replace(/\D/g, '');
    if (!nm || ph.length < 8) { toast(lang === 'ar' ? 'اسم وتليفون المستلم من فضلك' : lang === 'ru' ? 'Имя и телефон получателя' : 'Recipient name and phone, please'); return; }
    const code = 'NB-GIFT-' + Math.floor(1000 + Math.random() * 9000);
    writeLS('nb-gifts', { code: code, value: giftVal, to: nm, ts: Date.now() });
    $('#giftVal').textContent = giftVal + ' EGP';
    $('#giftTo').textContent = (lang === 'ar' ? 'إلى: ' : lang === 'ru' ? 'кому: ' : 'for: ') + nm + (($('#giftMsg').value.trim()) ? ' — “' + $('#giftMsg').value.trim() + '”' : '');
    $('#giftCode').textContent = code;
    buildQr($('#giftQr'));
    $('#giftS1').hidden = true; $('#giftS2').hidden = false;
    toast(lang === 'ar' ? 'الهدية في الطريق' : lang === 'ru' ? 'Подарок отправлен' : 'Gift on its way');
  });
  $('#giftDone').addEventListener('click', () => $('#giftModal').classList.remove('is-on'));

  /* ==================================================== P2: INVESTOR ROOM */
  const INV_PDF = 'data:application/pdf;base64,@@INV_B64@@';
  $('#invUnlock').addEventListener('click', () => {
    if ($('#invCode').value.trim().toUpperCase() !== 'NILE-2029') {
      toast(lang === 'ar' ? 'الكود غلط — الدخول الحقيقي بـNDA' : lang === 'ru' ? 'Код неверный — реальный доступ по NDA' : 'Wrong code — real access is via NDA');
      return;
    }
    $('#invBody').hidden = false;
    const vals = [0.42, 0.55, 0.61, 0.7, 0.78, 0.86, 0.92, 1.0, 1.06, 1.12, 1.18, 1.24];
    const svg = $('#invChart');
    const W = 640, H = 200, PB = 26, PT = 12;
    const max = 1.4;
    svg.innerHTML = vals.map((v, i) => {
      const bw = (W - 40) / vals.length - 8;
      const x = 20 + i * ((W - 40) / vals.length);
      const h = (v / max) * (H - PT - PB);
      return '<rect x="' + x.toFixed(1) + '" y="' + (H - PB - h).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="6" fill="' + (i === vals.length - 1 ? '#E0A72C' : 'rgba(224,167,44,.38)') + '"/>' +
        '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="9" fill="rgba(245,239,224,.45)" font-family="Archivo">M' + (i + 1) + '</text>';
    }).join('') + '<text x="20" y="16" font-size="10" fill="rgba(245,239,224,.6)" font-family="Archivo" font-weight="700">REVENUE RUN-RATE, M EGP / MONTH</text>';
    $('#invOnePager').href = INV_PDF;
    toast(lang === 'ar' ? 'اتفتحت المؤشرات (ديمو)' : lang === 'ru' ? 'Метрики открыты (демо)' : 'Metrics unlocked (demo)');
  });

  /* ==================================================== CUP DEEP-LINK / PERSIST */
  function cupToString() { return [state.bite, state.size, state.sauce].concat(state.tops).join('-'); }
  function syncCup() {
    try {
      const q = new URLSearchParams(location.search);
      q.set('cup', cupToString());
      history.replaceState(null, '', location.pathname + '?' + q.toString() + location.hash);
      localStorage.setItem('nb-cup', JSON.stringify(state));
    } catch (e) {}
  }
  function cupFromString(str) {
    if (!str) return null;
    const parts = String(str).split('-');
    const bite = parts[0], size = parts[1], sauce = parts[2];
    if (!PRICING[bite] || !SIZES[size] || !SAUCES[sauce]) return null;
    return { bite: bite, size: size, sauce: sauce, tops: parts.slice(3).filter(t => TOPS[t]) };
  }
  (function restoreCup() {
    let saved = cupFromString(new URLSearchParams(location.search).get('cup'));
    if (!saved) {
      try {
        const j = JSON.parse(localStorage.getItem('nb-cup') || 'null');
        if (j && PRICING[j.bite] && SAUCES[j.sauce] && SIZES[j.size]) saved = { bite: j.bite, size: j.size, sauce: j.sauce, tops: (j.tops || []).filter(t => TOPS[t]) };
      } catch (e) {}
    }
    if (saved) { state.bite = saved.bite; state.size = saved.size; state.sauce = saved.sauce; state.tops = saved.tops; }
  })();
  $('#shareCup').addEventListener('click', () => {
    syncCup();
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(location.href).catch(() => {});
    toast(lang === 'ar' ? 'لينك كوبك اتنسخ' : lang === 'ru' ? 'Ссылка на твой стакан скопирована' : 'Your cup link copied — send it to a friend');
  });

  /* ==================================================== NILE LAB: FUTURE FEATURES */
  const GEN = { mood: null, spice: null, diet: null };
  function genSay(txt, user) {
    const d = document.createElement('div');
    d.className = 'gen__msg' + (user ? ' gen__msg--u' : '');
    d.textContent = txt;
    $('#genChat').appendChild(d);
    while ($('#genChat').children.length > 5) $('#genChat').firstChild.remove();
  }
  genSay(lang === 'ar' ? 'أهلا! أنا Nile Genius. اختار ٣ حاجات وابني كوبك.' : lang === 'ru' ? 'Привет! Я Nile Genius. Выбери три пункта — соберу твой стакан.' : 'Hi! I am Nile Genius. Pick three things and I will build your cup.');
  $$('.gen__row').forEach(row => row.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip', row).forEach(x => x.classList.toggle('is-on', x === b));
    GEN[row.dataset.g] = b.dataset.v;
    genSay(b.textContent.trim(), true);
    if (GEN.mood && GEN.spice && GEN.diet) {
      const g = geniusPick();
      genSay(lang === 'ar' ? 'اختياري: ' + g.sayAr : lang === 'ru' ? 'Мой пик: ' + g.sayRu : 'My pick: ' + g.sayEn);
      $('#genApply').hidden = false;
    }
  }));
  function geniusPick() {
    let bite = 'shawarma', sauce = 'garlic', size = '12', tops = ['onion'];
    if (GEN.diet === 'veg') { bite = 'cheese'; sauce = 'tahini'; }
    else if (GEN.spice === 'fire') { bite = 'kofta'; sauce = 'shatta'; tops = ['chilli', 'onion']; }
    else if (GEN.spice === 'hot') { sauce = 'shatta'; }
    if (GEN.mood === 'hungry') size = '18';
    if (GEN.mood === 'light') { size = '8'; tops = ['herbs', 'lemon']; }
    if (GEN.mood === 'late') tops = ['onion', 'cheese'];
    const sayEn = bite + ' · ' + size + ' bites · ' + sauce + ' sauce' + (GEN.mood === 'fire' ? ' · brave' : '');
    return { bite: bite, sauce: sauce, size: size, tops: tops,
      sayEn: sayEn, sayAr: bite + ' · ' + size + ' بايتس · صوص ' + sauce, sayRu: bite + ' · ' + size + ' байтс · соус ' + sauce };
  }
  $('#genApply').addEventListener('click', () => {
    const g = geniusPick();
    state.bite = g.bite; state.sauce = g.sauce; state.size = g.size; state.tops = g.tops.filter(t => TOPS[t]);
    renderBuilder(false);
    document.getElementById('builder').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    toast(lang === 'ar' ? 'الجينيوس بنى كوبك' : lang === 'ru' ? 'Genius собрал твой стакан' : 'Genius built your cup');
  });

  const SAVES = [
    { id: 'sv1', t: '23:00–01:00', what: '14× Beef Kofta cups', off: '-30%' },
    { id: 'sv2', t: '00:30–02:00', what: '6× Cheese & Herb cups', off: '-40%' }
  ];
  function renderSaves() {
    const claimed = JSON.parse(localStorage.getItem('nb-saves') || '[]');
    $('#saveList').innerHTML = SAVES.map(sv =>
      '<div class="save__row"><b>' + sv.off + '</b><span>' + sv.what + ' · ' + sv.t + '</span>' +
      '<button class="mini-claim" data-save="' + sv.id + '"' + (claimed.indexOf(sv.id) > -1 ? ' disabled' : '') + '>' +
      (claimed.indexOf(sv.id) > -1 ? (lang === 'ar' ? 'محجوز' : lang === 'ru' ? 'занято' : 'claimed') : (lang === 'ar' ? 'احجز' : lang === 'ru' ? 'взять' : 'claim')) + '</button></div>').join('');
    $$('#saveList [data-save]').forEach(b => b.addEventListener('click', () => {
      writeLS('nb-saves', { id: b.dataset.save, ts: Date.now() });
      toast(lang === 'ar' ? 'اتحجز! خلاص الكوب ليك — وفّرنا فاقد' : lang === 'ru' ? 'Готово! Стакан твой — ноль списаний' : 'Claimed! Cup saved from the bin — waste zero');
      renderSaves();
    }));
  }
  renderSaves();

  const AR_LINES = [
    ['This cup started by the Nile.', 'الكوب ده بدأ من النيل.', 'Этот стакан начался у Нила.'],
    ['Hand-folded bites, 4 minutes hot.', 'بايتس متلففة بإيد، ٤ دقايق سخنة.', 'Ручная лепка, 4 минуты до горячего.'],
    ['Scan done. Story told. Taste it.', 'المسح تم. الحكاية اتحكت. دوق.', 'Скан пройден. История рассказана. Пробуй.']
  ];
  let arTimer = null, arI = 0;
  function arCap() { const l = AR_LINES[arI % AR_LINES.length]; $('#arCap').textContent = lang === 'ar' ? l[1] : lang === 'ru' ? l[2] : l[0]; arI++; }
  $('#arOpen').addEventListener('click', () => {
    $('#arModal').classList.add('is-on'); document.body.style.overflow = 'hidden';
    arCap(); arTimer = setInterval(arCap, 3000);
  });
  function arClose() { $('#arModal').classList.remove('is-on'); document.body.style.overflow = ''; clearInterval(arTimer); }
  $('#arClose').addEventListener('click', arClose);
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#arModal').classList.contains('is-on')) arClose(); });

  function nfcEcho() {
    const n = JSON.parse(localStorage.getItem('nb-taps') || '[]').length;
    $('#nfcEcho').textContent = (lang === 'ar' ? 'تابات النهارده: ' : lang === 'ru' ? 'тапов сегодня: ' : 'taps today: ') + n;
  }
  nfcEcho();
  $('#nfcTap').addEventListener('click', () => {
    const b = $('#nfcTap');
    b.classList.remove('is-tap'); void b.offsetWidth; b.classList.add('is-tap');
    writeLS('nb-taps', { ts: Date.now(), cup: 'NB-CUP-' + Math.floor(1000 + Math.random() * 9000) });
    toast(lang === 'ar' ? 'تاب! +١٢ نقطة والكوب أصلي ✓' : lang === 'ru' ? 'Тап! +12 очков, стакан аутентичен ✓' : 'Tap! +12 points · cup authenticated ✓');
    nfcEcho();
  });

  /* ==================================================== NILE LAB H2: VOICE / PASS / ROBOT / IOT / LEDGER */
  const VOICE_SAMPLES = ['twelve kofta with shatta and crispy onion', '٨ جبنة طحينة', 'восемнадцать шаурма гарлик сыр'];
  let voiceI = 0;
  function parseVoice(t) {
    const low = t.toLowerCase();
    const bite = /kofta|كفتة|кофта/.test(low) ? 'kofta' : /cheese|جبنة|сыр/.test(low) ? 'cheese' : /shrimp|جمبري|кревет/.test(low) ? 'shrimp' : 'shawarma';
    const sauce = /shatta|شطة|шатт/.test(low) ? 'shatta' : /tahini|طحينة|тахин/.test(low) ? 'tahini' : /signature|سيجنتشر|сигн/.test(low) ? 'signature' : 'garlic';
    const size = /18|eighteen|١٨|восемнадцать/.test(low) ? '18' : /8|eight|٨|восемь/.test(low) ? '8' : '12';
    const tops = [];
    if (/onion|بصل|лук/.test(low)) tops.push('onion');
    if (/cheese|جبنة|сыр/.test(low) && bite !== 'cheese') tops.push('cheese');
    if (/herbs|أعشاب|трав/.test(low)) tops.push('herbs');
    return { bite: bite, sauce: sauce, size: size, tops: tops };
  }
  function showIntent(v) {
    $('#voiceIntent').innerHTML =
      '<span class="chip is-on">' + v.size + ' bites</span><span class="chip is-on">' + v.bite + '</span>' +
      '<span class="chip is-on">' + v.sauce + '</span>' + v.tops.map(t => '<span class="chip is-on">' + t + '</span>').join('');
    $('#voiceApply').hidden = false;
    $('#voiceApply').onclick = () => {
      state.bite = v.bite; state.sauce = v.sauce; state.size = v.size; state.tops = v.tops;
      renderBuilder(false);
      document.getElementById('builder').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      toast(lang === 'ar' ? 'الطلب الصوتي اتطبق' : lang === 'ru' ? 'Голосовой заказ применён' : 'Voice order applied to your cup');
    };
  }
  $('#voiceBtn').addEventListener('click', () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const b = $('#voiceBtn');
    b.classList.add('is-tap'); setTimeout(() => b.classList.remove('is-tap'), 1200);
    if (SR) {
      let done = false;
      const fallback = () => { if (done) return; done = true;
        $('#voiceTxt').textContent = (lang === 'ru' ? 'микрофон/сеть недоступны — демо-фраза: ' : 'mic unavailable — demo phrase: ') + '“' + VOICE_SAMPLES[voiceI % 3] + '”';
        showIntent(parseVoice(VOICE_SAMPLES[voiceI++ % 3])); };
      const rec = new SR();
      rec.lang = lang === 'ar' ? 'ar-EG' : lang === 'ru' ? 'ru-RU' : 'en-US';
      rec.onresult = e => { done = true; const t = e.results[0][0].transcript; $('#voiceTxt').textContent = '“' + t + '”'; showIntent(parseVoice(t)); };
      rec.onerror = fallback;
      setTimeout(fallback, 1600);
      try { rec.start(); } catch (e) { fallback(); }
    } else {
      const t = VOICE_SAMPLES[voiceI++ % 3];
      $('#voiceTxt').textContent = '“' + t + '” (demo)';
      showIntent(parseVoice(t));
    }
  });

  $('#passJoin').addEventListener('click', () => {
    writeLS('nb-pass', { plan: '30d', price: 1999, ts: Date.now() });
    $('#passJoin').disabled = true;
    $('#passCard').hidden = false;
    buildQr($('#passQr'));
    toast(lang === 'ar' ? 'الـPASS شغال! كوب كل يوم لمدة ٣٠ يوم' : lang === 'ru' ? 'Nile Pass активен: стакан в день, 30 дней' : 'Nile Pass active: one cup a day for 30 days');
  });

  let iotSec = 14 * 60;
  setInterval(() => { if (iotSec > 0) iotSec--; const m = Math.floor(iotSec / 60), ss = iotSec % 60;
    const win = $('#iotWin'); if (win) win.textContent = (lang === 'ar' ? 'شباك المثالية يقفل بعد ' : lang === 'ru' ? 'окно идеала закроется через ' : 'perfect window closes in ') + m + ':' + String(ss).padStart(2, '0');
    const tmp = $('#iotTemp'); if (tmp) tmp.textContent = Math.max(52, 71 - Math.floor((840 - iotSec) / 60)) + '°C';
  }, 1000);
  $('#iotTap').addEventListener('click', () => {
    writeLS('nb-iot', { ts: Date.now(), temp: 68 + Math.floor(Math.random() * 5) });
    toast(lang === 'ar' ? 'القراءة: ٦٩°C — مثالي! الكوب أصلي NB-CUP-77' : lang === 'ru' ? 'Считано: 69°C — идеал! Стакан подлинный NB-CUP-77' : 'Read: 69°C — perfect! Cup authentic NB-CUP-77');
  });

  const LEDGER = [
    { v: '412 kg', t: 'food waste YTD', p: 38, n: '−38% vs plan' },
    { v: '9,180', t: 'cups diverted (Smart Save)', p: 76, n: 'since launch' },
    { v: '87%', t: 'packaging recycled', p: 87, n: 'audited monthly' },
    { v: '0', t: 'unverified claims', p: 100, n: 'brand rule #6' }
  ];
  $('#ledger').innerHTML = LEDGER.map(l => '<div><b>' + l.v + '</b><i>' + l.t + '</i><u><span style="width:' + l.p + '%"></span></u><i style="margin-top:6px;color:#6FD3A8">' + l.n + '</i></div>').join('');

  /* ==================================================== NILE LAB H3: TASTE / TICKET / COPILOT */
  const TASTE = { heat: null, cream: null, fresh: null };
  let tasteBlend = null;
  $$('.gen__row[data-t]').forEach(row => row.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip', row).forEach(x => x.classList.toggle('is-on', x === b));
    TASTE[row.dataset.t] = b.dataset.v;
    if (TASTE.heat && TASTE.cream && TASTE.fresh) { tasteCalc(); }
  }));
  function tasteCalc() {
    const g = { garlic: 40, tahini: 20, shatta: 20, signature: 20 };
    if (TASTE.heat === 'fire') { g.shatta += 30; g.garlic -= 10; g.signature -= 10; g.tahini -= 10; }
    if (TASTE.heat === 'mild') { g.shatta -= 15; g.garlic += 10; g.tahini += 5; }
    if (TASTE.cream === 'creamy') { g.tahini += 20; g.shatta -= 10; g.signature -= 10; }
    if (TASTE.cream === 'light') { g.tahini -= 10; g.garlic += 5; g.signature += 5; }
    if (TASTE.fresh === 'citrus') { g.signature += 15; g.tahini -= 5; g.garlic -= 10; }
    if (TASTE.fresh === 'herbs') { g.garlic += 10; g.signature -= 5; g.shatta -= 5; }
    const sum = g.garlic + g.tahini + g.shatta + g.signature;
    Object.keys(g).forEach(k => { g[k] = Math.max(0, Math.round(g[k] * 100 / sum)); });
    tasteBlend = g;
    const name = (TASTE.heat === 'fire' ? 'FIRE' : TASTE.heat === 'mild' ? 'CALM' : 'WARM') + '-' +
      (TASTE.cream === 'creamy' ? 'CREAM' : 'LIGHT') + '-' + (TASTE.fresh === 'none' ? 'PURE' : TASTE.fresh.toUpperCase());
    $('#tasteName').textContent = 'BLEND ' + name + ' · ID NB-TST-' + (1000 + (name.length * 37) % 9000);
    $('#tasteBlend').innerHTML = Object.keys(g).map(k =>
      '<div><span>' + k + '</span><u><span style="width:' + g[k] + '%"></span></u><b>' + g[k] + '%</b></div>').join('');
    $('#tasteOut').hidden = false;
  }
  $('#tasteSave').addEventListener('click', () => {
    writeLS('nb-taste', { blend: tasteBlend, ts: Date.now() });
    toast(lang === 'ar' ? 'الـTaste ID اتحفظ في ناديك' : lang === 'ru' ? 'Taste ID сохранён в Club' : 'Taste ID saved to your Club');
  });
  $('#tasteApply').addEventListener('click', () => {
    const top = Object.keys(tasteBlend).sort((a, b) => tasteBlend[b] - tasteBlend[a])[0];
    state.sauce = top === 'garlic' ? 'garlic' : top;
    renderBuilder(false);
    document.getElementById('builder').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    toast(lang === 'ar' ? 'الكوب اتظبط على خلطتك' : lang === 'ru' ? 'Стакан настроен под твой бленд' : 'Cup tuned to your blend');
  });

  const PERKS = [
    { id: 'felucca', t: 'Felucca sunset ride', d: '−20% · Marina dock 4', v: '-20%' },
    { id: 'museum', t: 'Museum café combo', d: 'free mint tea with cup', v: 'TEA' },
    { id: 'market', t: 'Night market stall 12', d: '−15% on spices', v: '-15%' }
  ];
  $('#ticketGo').addEventListener('click', () => {
    const id = $('#ticketId').value.trim() || 'NB-CUP-' + Math.floor(1000 + Math.random() * 9000);
    $('#ticketPerks').hidden = false;
    $('#ticketPerks').innerHTML = '<p class="lab__p lab__p--sm">' + id + ' ✓ authentic · perks unlocked:</p>' +
      PERKS.map(pk => '<div class="save__row"><b>' + pk.v + '</b><span>' + pk.t + ' · ' + pk.d + '</span><button class="mini-claim" data-perk="' + pk.id + '">' + (lang === 'ar' ? 'فعّل' : lang === 'ru' ? 'взять' : 'activate') + '</button></div>').join('');
    $$('#ticketPerks [data-perk]').forEach(b => b.addEventListener('click', () => {
      writeLS('nb-ticket', { cup: id, perk: b.dataset.perk, ts: Date.now() });
      b.disabled = true; b.textContent = lang === 'ar' ? 'مفعّل' : lang === 'ru' ? 'активно' : 'active';
      toast(lang === 'ar' ? 'التذكرة اتفعّلت مع الشريك' : lang === 'ru' ? 'Перк активирован у партнёра' : 'Perk activated with partner');
    }));
  });

  /* Franchise AI co-pilot */
  const nf = n => Math.round(n).toLocaleString('en-US');
  const CP = { format: 'kiosk' };
  const CP_FMT = {
    kiosk:    { capexUsd: 65000,  payroll: 90000,  cap: 0.8,  max: 250, label: 'Kiosk' },
    street:   { capexUsd: 100000, payroll: 248000, cap: 1.0,  max: 450, label: 'Street store' },
    flagship: { capexUsd: 135000, payroll: 400000, cap: 1.25, max: 700, label: 'Flagship' }
  };
  function cpCalc() {
    const traffic = +$('#cpTraffic').value, rent = +$('#cpRent').value * 1000, comp = +$('#cpComp').value;
    $('#cpTrafficV').textContent = traffic; $('#cpRentV').textContent = Math.round(rent / 1000); $('#cpCompV').textContent = comp;
    const f = CP_FMT[CP.format];
    const capture = 0.02 * (1 - comp * 0.09) * f.cap;   // site-only capture, conservative
    const orders = Math.min(f.max, Math.round(traffic * 1000 * capture));
    const rev = orders * 114 * 30;
    const food = rev * 0.37, mkt = rev * 0.04, other = rev * 0.05;
    const ebitda = rev - food - mkt - other - rent - f.payroll;
    const margin = rev ? ebitda / rev * 100 : 0;
    const payback = ebitda > 0 ? Math.round(f.capexUsd * 50 / ebitda) : 99;
    let score = 50 + (margin - 15) * 1.6 + (18 - Math.min(payback, 24)) * 1.8 + (traffic - 20) * 0.35 - comp * 2.2;
    score = Math.max(4, Math.min(97, Math.round(score)));
    $('#cpScore').textContent = score;
    $('#cpScore').style.color = score > 70 ? '#6FD3A8' : score > 45 ? '#E0A72C' : '#F08A72';
    $('#cpRows').innerHTML =
      '<div><span>orders / day</span><b>' + orders + '</b></div>' +
      '<div><span>revenue / month</span><b>' + nf(rev) + ' EGP</b></div>' +
      '<div><span>EBITDA / month</span><b>' + nf(ebitda) + ' EGP</b></div>' +
      '<div><span>margin</span><b>' + margin.toFixed(1) + '%</b></div>' +
      '<div><span>payback</span><b>' + (payback > 40 ? '40+' : payback) + ' mo</b></div>' +
      '<div><span>note</span><b style="font-size:11px">sim conservative: +30–60% via delivery/WA</b></div>';
    const v = $('#cpVerdict');
    if (score > 70) { v.className = 'copilot__verdict ok'; v.textContent = lang === 'ar' ? 'موقع قوي — يستاهل discovery call' : lang === 'ru' ? 'Сильная локация — заслуживает discovery-звонка' : 'Strong site — deserves a discovery call'; }
    else if (score > 45) { v.className = 'copilot__verdict mid'; v.textContent = lang === 'ar' ? 'ممكن يشتغل بشروط: فاوض الإيجار أو غيّر الفورمات' : lang === 'ru' ? 'Работает с условиями: торгуйся по аренде или меняй формат' : 'Workable with conditions: negotiate rent or shift format'; }
    else { v.className = 'copilot__verdict bad'; v.textContent = lang === 'ar' ? 'الإيجار/المنافسة تقتل الوحدة — دور موقع تاني' : lang === 'ru' ? 'Аренда/конкуренция убивают юнит — ищи другую локацию' : 'Rent/competition kill the unit — scout another site'; }
    return { traffic: traffic, rent: rent, comp: comp, format: CP.format, orders: orders, rev: rev, ebitda: ebitda, score: score };
  }
  ['#cpTraffic', '#cpRent', '#cpComp'].forEach(id => $(id).addEventListener('input', cpCalc));
  $$('.chips[data-cp="format"] .chip').forEach(ch => ch.addEventListener('click', () => {
    $$('.chips[data-cp="format"] .chip').forEach(x => x.classList.toggle('is-on', x === ch));
    CP.format = ch.dataset.v; cpCalc();
  }));
  $('#cpSend').addEventListener('click', () => {
    const r = cpCalc();
    writeLS('nb-sim', r);
    toast(lang === 'ar' ? 'المحاكاة وصلت الفريق — رد خلال ٢٤ ساعة' : lang === 'ru' ? 'Симуляция у команды — ответ за 24 ч' : 'Sim received by franchise team — reply within 24 h');
  });
  cpCalc();

  /* ============================================================ init */
  renderBuilder(true);
  applyLang(lang);
})();
