/* ==========================================================================
   NILE ADMIN — concept dashboard logic (simulated data)
   ========================================================================== */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const egp = n => fmt(n) + ' EGP';

  let toastT;
  function toast(m) {
    const t = $('#toast'); t.textContent = m; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2400);
  }

  /* ------------------------------------------------------------ login */
  const loginBox = $('#login');
  function unlock() { loginBox.classList.add('is-off'); $('#adm').hidden = false; try { sessionStorage.setItem('nb-admin', '1'); } catch (e) {} }
  try { if (sessionStorage.getItem('nb-admin') === '1') unlock(); } catch (e) {}
  $('#loginForm').addEventListener('submit', e => {
    e.preventDefault();
    if ($('#pin').value.trim() === '2026') unlock();
    else { $('#pinErr').textContent = 'Wrong PIN. Demo PIN: 2026'; $('#pin').value = ''; }
  });

  /* ------------------------------------------------------------ data */
  const P = [
    { id: 'kofta', name: 'Beef Kofta', price: 145, sold: 132, on: true, waste: 2.1, rate: 4.6,},
    { id: 'shawarma', name: 'Chicken Shawarma', price: 140, sold: 148, on: true, waste: 2.6, rate: 4.4,},
    { id: 'shatta', name: 'Shatta Beef', price: 150, sold: 74, on: true, waste: 3.4, rate: 4.2,},
    { id: 'cheese', name: 'Cheese & Herb', price: 125, sold: 52, on: true, waste: 6.8, rate: 3.6,},
    { id: 'shrimp', name: 'Nile Shrimp', price: 175, sold: 22, on: false, waste: 5.9, rate: 4.5,}
  ];
  const SAUCES = [
    { name: 'Garlic', v: 46, c: '#F3E6C4' }, { name: 'Tahini', v: 22, c: '#D8C39A' },
    { name: 'Shatta', v: 18, c: '#C0392B' }, { name: 'Signature', v: 14, c: '#E0A72C' }
  ];
  const HOURS = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '00', '01'];
  const HOUR_VAL = [12, 18, 26, 34, 30, 24, 28, 40, 55, 66, 61, 47, 36, 26, 16, 9];
  const INV = [
    { n: 'Beef, kg', v: 62, s: 'ok' }, { n: 'Chicken, kg', v: 38, s: 'ok' }, { n: 'Cheese, kg', v: 21, s: 'low' },
    { n: 'Shrimp, kg', v: 74, s: 'ok' }, { n: 'Cups, pcs', v: 55, s: 'ok' }, { n: 'Garlic sauce, L', v: 18, s: 'low' },
    { n: 'Shatta, L', v: 66, s: 'ok' }, { n: 'Bags, pcs', v: 47, s: 'ok' }
  ];
  const CUST = [
    { n: 'Omar El-Sayed', t: 'Gold', p: 480, v: 31, l: 'today' },
    { n: 'Lena Fischer', t: 'Silver', p: 260, v: 17, l: 'today' },
    { n: 'Mariam Adel', t: 'Gold', p: 415, v: 26, l: 'yesterday' },
    { n: 'Ivan Petrov', t: 'Bronze', p: 90, v: 6, l: '2 d ago' },
    { n: 'Youssef Nabil', t: 'Silver', p: 230, v: 15, l: 'yesterday' },
    { n: 'Sara Mansour', t: 'Bronze', p: 70, v: 5, l: '3 d ago' }
  ];
  const LEADS = [
    { n: 'Hassan Group', c: 'Cairo, EG', b: '$400k–$1M', s: 'Discovery', d: '26 Sep' },
    { n: 'M. Al-Farsi', c: 'Dubai, AE', b: '$1M+', s: 'Deck sent', d: '25 Sep' },
    { n: 'Red Sea Foods', c: 'Sharm, EG', b: '$150k–$400k', s: 'Qualified', d: '24 Sep' },
    { n: 'A. Ivanova', c: 'Hurghada, EG', b: '$50k–$150k', s: 'New', d: '27 Sep' },
    { n: 'Delta Foods', c: 'Alexandria, EG', b: '$150k–$400k', s: 'Call booked', d: '22 Sep' },
    { n: 'Gulf Snacks Co', c: 'Riyadh, SA', b: '$1M+', s: 'Paused', d: '12 Sep' },
    { n: 'Quick Bite LLC', c: 'Cairo, EG', b: '$50k–$150k', s: 'Paused', d: '08 Sep' }
  ];
  const CAMPS = [
    { n: 'TikTok · First Bite', k: 'UGC spark', reach: '412K', ctr: '4.8%', roas: '5.1×' },
    { n: 'IG · Sauce Porn', k: 'Reels loop', reach: '268K', ctr: '3.9%', roas: '4.2×' },
    { n: 'QR · Cup-to-Club', k: 'Packaging', reach: '1.2K scans', ctr: '49% rate', roas: '∞ owned' }
  ];
  const CHANNELS = [
    { name: 'Walk-in', v: 44, c: '#E0A72C' }, { name: 'Talabat', v: 26, c: '#E2703A' },
    { name: 'Elmenus', v: 14, c: '#3FA98A' }, { name: 'WhatsApp', v: 9, c: '#6FD3A8' }, { name: 'Site', v: 7, c: '#D8C39A' }
  ];
  const CHECK30 = [98, 101, 99, 104, 106, 103, 108, 110, 107, 112, 109, 114, 111, 116, 113, 118, 115, 112, 117, 114, 119, 116, 121, 118, 115, 120, 117, 122, 119, 114];
  const LOY_ISS = [420, 510, 480, 610, 560, 640, 700, 660, 720, 780, 740, 820, 860, 900];
  const LOY_RED = [180, 210, 240, 260, 300, 280, 340, 360, 330, 400, 420, 410, 460, 480];

  function rd(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; } }
  function siteOrders() {
    return rd('nb-orders').map(r => {
      const d = new Date(r.ts);
      return { id: r.id, time: String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'), items: r.items + ' · ' + r.mode, ch: 'site', total: r.total, st: 'done', live: true };
    });
  }

  /* -------- the dark side: cancellations, complaints, waste, churn -------- */
  const CANCELLED = [
    { id: 'NB-1031', time: '20:41', items: '12× Shatta Beef · Shatta', ch: 'talabat', total: 150, st: 'cancel', why: 'customer changed mind' },
    { id: 'NB-1027', time: '20:12', items: '12× Beef Kofta · Garlic', ch: 'site', total: 145, st: 'cancel', why: 'kitchen timeout 19 min (SLA)' },
    { id: 'NB-1019', time: '19:02', items: '12× Cheese & Herb · Tahini', ch: 'elmenus', total: 125, st: 'cancel', why: 'out of stock: cheese' },
    { id: 'NB-1012', time: '18:20', items: '12× Chicken Shawarma · Garlic', ch: 'whatsapp', total: 155, st: 'cancel', why: 'payment failed ×2' }
  ];
  const COMPLAINTS = [
    { id: 'SC-4411', sku: 'Shawarma', stars: 2, txt: 'sauce leaked in the bag', st: 'open', t: '21:14' },
    { id: 'SC-4402', sku: 'Kofta', stars: 1, txt: 'cold bites, long wait at counter', st: 'open', t: '20:02' },
    { id: 'SC-4396', sku: 'Cheese', stars: 2, txt: 'too salty today', st: 'resolved', t: '18:40' }
  ];
  const SLA_BREACH = [
    { id: 'NB-1027', wait: '19 min', st: 'refunded' }, { id: 'NB-1033', wait: '14 min', st: 'open' }, { id: 'NB-1038', wait: '13 min', st: 'open' }
  ];
  const WASTE = [
    { name: 'Cheese & Herb', v: 6.8 }, { name: 'Nile Shrimp', v: 5.9 }, { name: 'Shatta Beef', v: 3.4 },
    { name: 'Chicken Shawarma', v: 2.6 }, { name: 'Beef Kofta', v: 2.1 }
  ];
  const REFUNDS = [
    { id: 'NB-1012', sum: 155, why: 'payment failed, double charge', res: 'refunded' },
    { id: 'NB-1027', sum: 145, why: 'SLA breach > 15 min', res: 'refunded' },
    { id: 'NB-1019', sum: 125, why: 'item unavailable at pickup', res: 'store credit' }
  ];
  const CHURN = [
    { n: 'Karim F.', last: '41 d ago', v: 9 }, { n: 'Sofia M.', last: '38 d ago', v: 6 }, { n: 'Tarek H.', last: '35 d ago', v: 11 }
  ];

  const CHAN_NAMES = ['walk-in', 'talabat', 'elmenus', 'whatsapp', 'site'];
  const STATUSES = ['new', 'prep', 'ready', 'done'];
  const ST_LABEL = { new: 'New', prep: 'Preparing', ready: 'Ready', done: 'Done', cancel: 'Cancelled' };

  /* ------------------------------------------------------------ state */
  const S = { sec: 'sales', range: 'today', live: true, q: '', f: 'all', orders: [], seq: 1041 };

  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function makeOrder(back) {
    const p = rnd(P.filter(x => x.on));
    const size = rnd(['8', '12', '12', '12', '18']);
    const sauce = rnd(SAUCES).name;
    const base = p.price + ({ '8': -40, '12': 0, '18': 45 })[size] + (sauce === 'Signature' ? 10 : 0);
    const d = new Date(Date.now() - (back || 0) * 60000);
    return {
      id: 'NB-' + (S.seq++),
      ts: d.getTime(),
      time: d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0'),
      items: size + '× ' + p.name + ' · ' + sauce,
      ch: rnd(CHAN_NAMES),
      total: base,
      st: back ? rnd(STATUSES) : 'new'
    };
  }
  for (let i = 0; i < 16; i++) S.orders.push(makeOrder(i * 7 + 2));
  S.orders.forEach(o => { if (o.st === 'new' || o.st === 'prep') o.ts = Date.now() - Math.floor(1 + Math.random() * 13) * 60000; });
  S.orders.sort((a, b) => (a.time < b.time ? 1 : -1));

  /* ------------------------------------------------------------ charts */
  function area(svg, vals, opt) {
    opt = opt || {};
    const W = 640, H = svg.viewBox.baseVal.height || 220, PL = 34, PR = 12, PT = 14, PB = 26;
    const max = Math.max.apply(null, vals) * 1.15, min = 0;
    const x = i => PL + i * (W - PL - PR) / (vals.length - 1);
    const y = v => PT + (1 - (v - min) / (max - min)) * (H - PT - PB);
    let d = '', a = '';
    vals.forEach((v, i) => { d += (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(v).toFixed(1); });
    a = d + 'L' + x(vals.length - 1).toFixed(1) + ',' + (H - PB) + 'L' + x(0).toFixed(1) + ',' + (H - PB) + 'Z';
    const pi = vals.indexOf(Math.max.apply(null, vals));
    let g = '<defs><linearGradient id="g' + svg.id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0A72C" stop-opacity=".38"/><stop offset="1" stop-color="#E0A72C" stop-opacity="0"/></linearGradient></defs>';
    g += '<path d="' + a + '" fill="url(#g' + svg.id + ')"/>';
    g += '<path d="' + d + '" fill="none" stroke="#E0A72C" stroke-width="2.6" stroke-linecap="round"/>';
    g += '<circle cx="' + x(pi) + '" cy="' + y(vals[pi]) + '" r="5" fill="#0B0906" stroke="#F2CE72" stroke-width="2.6"/>';
    (opt.labels || []).forEach((l, i) => {
      if (l !== null) g += '<text x="' + x(i) + '" y="' + (H - 8) + '" fill="rgba(245,239,224,.4)" font-size="10" text-anchor="middle" font-family="Archivo">' + l + '</text>';
    });
    for (let t = 0; t <= 3; t++) {
      const yy = PT + t * (H - PT - PB) / 3;
      g += '<line x1="' + PL + '" y1="' + yy + '" x2="' + (W - PR) + '" y2="' + yy + '" stroke="rgba(245,239,224,.07)"/>';
      g += '<text x="' + (PL - 8) + '" y="' + (yy + 3) + '" fill="rgba(245,239,224,.32)" font-size="9.5" text-anchor="end" font-family="Archivo">' + fmt(max * (1 - t / 3)) + '</text>';
    }
    svg.innerHTML = g;
  }
  function hbars(svg, items) {
    const max = Math.max.apply(null, items.map(i => i.v));
    let g = '';
    items.forEach((it, i) => {
      const y = 14 + i * 42, w = 470 * it.v / max;
      g += '<text x="0" y="' + (y + 12) + '" fill="rgba(245,239,224,.72)" font-size="12" font-family="Archivo" font-weight="700">' + it.name + '</text>';
      g += '<rect x="150" y="' + y + '" width="420" height="18" rx="9" fill="rgba(245,239,224,.07)"/>';
      g += '<rect x="150" y="' + y + '" width="' + Math.max(6, w) + '" height="18" rx="9" fill="' + (it.c || '#E0A72C') + '"/>';
      g += '<text x="' + (150 + Math.max(6, w) + 10) + '" y="' + (y + 13) + '" fill="rgba(245,239,224,.6)" font-size="11.5" font-family="Archivo" font-weight="800">' + fmt(it.v) + (it.suf || '') + '</text>';
    });
    svg.innerHTML = g;
  }
  function donut(svg, items) {
    const cx = 110, cy = 120, r = 74, C = 2 * Math.PI * r;
    let off = 0, g = '';
    items.forEach(it => {
      const len = C * it.v / 100;
      g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + it.c + '" stroke-width="26" stroke-dasharray="' + len + ' ' + (C - len) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
      off += len;
    });
    g += '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" font-family="Anton" font-size="30" fill="#F5EFE0">46%</text>';
    g += '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-family="Archivo" font-size="10" fill="rgba(245,239,224,.5)" letter-spacing="2">GARLIC</text>';
    items.forEach((it, i) => {
      const y = 44 + i * 26;
      g += '<rect x="198" y="' + (y - 9) + '" width="10" height="10" rx="3" fill="' + it.c + '"/>';
      g += '<text x="214" y="' + y + '" font-family="Archivo" font-size="11" fill="rgba(245,239,224,.75)" font-weight="700">' + it.name + '</text>';
      g += '<text x="296" y="' + y + '" font-family="Archivo" font-size="11" fill="rgba(245,239,224,.5)" text-anchor="end" font-weight="800">' + it.v + '%</text>';
    });
    svg.innerHTML = g;
  }
  function funnel(svg, steps) {
    const max = steps[0].v;
    let g = '';
    steps.forEach((s, i) => {
      const w = 560 * s.v / max, x = (640 - w) / 2, y = 12 + i * 46;
      g += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="32" rx="10" fill="rgba(224,167,44,' + (0.9 - i * 0.18) + ')"/>';
      g += '<text x="320" y="' + (y + 21) + '" text-anchor="middle" font-family="Archivo" font-size="12.5" font-weight="800" fill="#0B0906">' + s.label + ' — ' + fmt(s.v) + '</text>';
    });
    svg.innerHTML = g;
  }

  /* ------------------------------------------------------------ kpis */
  function kpi(html) { return html; }
  function salesKpis() {
    const f = S.range === 'today' ? 1 : S.range === '7d' ? 6.4 : 26.1;
    const orders = 428 * f, rev = 48920 * f, avg = rev / orders;
    $('#kpiSales').innerHTML =
      kpi('<div class="kpi"><i>Orders</i><b class="num">' + fmt(orders) + '</b><u class="up">▲ 12% vs prev</u></div>') +
      kpi('<div class="kpi kpi--gold"><i>Revenue</i><b class="num">' + fmt(rev) + '<small>EGP</small></b><u class="up">▲ 15%</u></div>') +
      kpi('<div class="kpi"><i>Avg check</i><b class="num">' + fmt(avg) + '<small>EGP</small></b><u class="up">▲ 3%</u></div>') +
      kpi('<div class="kpi"><i>Top product</i><b style="font-size:19px;line-height:1.15">Chicken Shawarma</b><u class="fl">148 cups</u></div>') +
      kpi('<div class="kpi"><i>Top sauce</i><b style="font-size:19px;line-height:1.15">Garlic</b><u class="fl">46% of cups</u></div>') +
      kpi('<div class="kpi"><i>Peak hour</i><b style="font-size:19px;line-height:1.15">19:00–21:00</b><u class="fl">31% of orders</u></div>');
  }

  /* ------------------------------------------------------------ sections */
  const TITLES = { sales: 'Sales', orders: 'Orders', kds: 'Kitchen Display', risk: 'Risk & Exceptions', ai: 'AI & Forecasts', products: 'Products', inventory: 'Inventory', stores: 'Stores', customers: 'Customers', loyalty: 'Nile Club · Loyalty', marketing: 'Marketing', analytics: 'Analytics', franchise: 'Franchise' };

  function renderOrders() {
    const tb = $('#ordTable tbody');
    const all = siteOrders().concat(CANCELLED).concat(S.orders);
    $('#siteTag').textContent = 'site: ' + siteOrders().length;
    const rows = all.filter(o =>
      (S.f === 'all' || o.st === S.f) &&
      (!S.q || (o.id + o.items + o.ch).toLowerCase().includes(S.q))
    );
    tb.innerHTML = rows.map(o =>
      '<tr><td><b>' + o.id + '</b>' + (o.why ? '<div class="risknote">✕ ' + o.why + '</div>' : '') + '</td><td class="num">' + o.time + '</td><td>' + o.items + '</td><td>' + o.ch + '</td><td class="num"><b>' + o.total + ' EGP</b></td>' +
      '<td><span class="st st--' + o.st + '">' + ST_LABEL[o.st] + '</span></td>' +
      '<td>' + (o.st !== 'done' && o.st !== 'cancel' ? '<button class="mini" data-adv="' + o.id + '">' + (o.st === 'new' ? 'Start' : o.st === 'prep' ? 'Ready' : 'Complete') + '</button>' : '') + '</td></tr>'
    ).join('') || '<tr><td colspan="7" style="color:var(--mut2)">No orders match.</td></tr>';
    $$('#ordTable [data-adv]').forEach(b => b.addEventListener('click', () => {
      const o = S.orders.find(x => x.id === b.dataset.adv);
      o.st = STATUSES[STATUSES.indexOf(o.st) + 1];
      renderOrders(); renderFeed();
      toast(o.id + ' → ' + ST_LABEL[o.st]);
    }));
    $('#cntNew').textContent = S.orders.filter(o => o.st === 'new').length;
  }

  function renderFeed() {
    $('#liveFeed').innerHTML = S.orders.slice(0, 9).map(o =>
      '<div class="feed__row"><b>' + o.id + '</b><span>' + o.items + '</span><span class="sum num">' + o.total + '</span><span class="t">' + o.ch + ' · ' + o.time + '</span></div>'
    ).join('');
  }

  function renderProducts() {
    $('#prodTable thead').innerHTML = '<tr><th>Product</th><th>Price, EGP</th><th>Sold today</th><th>Revenue</th><th>Waste</th><th>Rating</th><th>On sale</th></tr>';
    $('#prodTable tbody').innerHTML = P.map(p =>
      '<tr><td><b>' + p.name + '</b></td>' +
      '<td><input class="pinput num" data-price="' + p.id + '" type="number" value="' + p.price + '"></td>' +
      '<td class="num">' + p.sold + '</td><td class="num">' + fmt(p.sold * p.price) + ' EGP</td>' +
      '<td><span class="st ' + (p.waste > 5 ? 'st--cancel' : p.waste > 3 ? 'st--warn' : 'st--ok') + '">' + p.waste + '%</span></td>' +
      '<td><span class="st ' + (p.rate < 4 ? 'st--cancel' : 'st--ok') + '">★ ' + p.rate + '</span></td>' +
      '<td><button class="sw' + (p.on ? ' is-on' : '') + '" data-on="' + p.id + '" aria-label="on sale"></button></td></tr>'
    ).join('');
    $$('#prodTable [data-on]').forEach(b => b.addEventListener('click', () => {
      const p = P.find(x => x.id === b.dataset.on);
      p.on = !p.on; b.classList.toggle('is-on', p.on);
      toast(p.name + (p.on ? ' back on sale' : ' marked sold-out') + ' · site menu synced');
    }));
    $$('#prodTable [data-price]').forEach(i => i.addEventListener('change', () => {
      const p = P.find(x => x.id === i.dataset.price);
      p.price = Math.max(1, parseInt(i.value, 10) || p.price); i.value = p.price;
      toast(p.name + ' price → ' + p.price + ' EGP · synced to site');
    }));
  }

  function renderInv() {
    $('#invList').innerHTML = INV.map(it =>
      '<div class="inv__row"><b>' + it.n + '</b><div class="bar"><span class="' + (it.v < 25 ? 'low' : '') + '" style="width:' + it.v + '%"></span></div>' +
      '<i class="num">' + it.v + '%</i><span class="st ' + (it.v < 25 ? 'st--low' : 'st--ok') + '">' + (it.v < 25 ? 'Reorder' : 'OK') + '</span></div>'
    ).join('');
    $('#invTag').textContent = INV.filter(i => i.v < 25).length + ' low stock';
  }

  function renderStores() {
    $('#storeCards').innerHTML =
      '<div class="panel"><h3>Hurghada · Sheraton <span class="tag">live</span></h3>' +
      '<p style="font-family:Anton;font-size:30px;letter-spacing:.02em">OPEN NOW</p>' +
      '<p class="note" style="margin:8px 0 14px">10:00 — 02:00 · 428 orders today · 48,920 EGP</p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="mini" data-t="Kitchen display refreshed">KDS</button><button class="mini" data-t="Shift report generated">Shift report</button><button class="mini" data-t="Hours updated">Edit hours</button></div></div>' +
      '<div class="panel"><h3>Cairo · Zamalek <span class="tag">2027</span></h3><p style="font-family:Anton;font-size:30px">FIT-OUT</p><p class="note" style="margin:8px 0 14px">Lease signed · opening Q1 2027 · hiring starts Nov</p><div style="display:flex;gap:8px"><button class="mini" data-t="Hiring plan opened">Hiring plan</button><button class="mini" data-t="Fit-out checklist opened">Checklist</button></div></div>' +
      '<div class="panel"><h3>Pipeline <span class="tag">4 cities</span></h3><p class="note" style="line-height:2">Sharm El Sheikh — site survey<br>Alexandria — lease negotiation<br>Marsa Alam — seasonality study<br>Luxor — tourism partner talks</p></div>';
    $$('#storeCards [data-t]').forEach(b => b.addEventListener('click', () => toast(b.dataset.t)));
    renderKiosks();
  }
  const KIOSKS = [
    { id: 'K1 · Marina promenade', auto: true, arm: '182°C', clean: '02:00 done', cv: 97, batt: '—', orders: 214 },
    { id: 'K2 · Food-court East', auto: false, arm: 'idle', clean: 'manual 23:40', cv: 94, batt: '—', orders: 168 }
  ];
  function renderKiosks() {
    $('#kioskFleet').innerHTML = KIOSKS.map((k, i) =>
      '<div class="panel" style="border-style:dashed"><h3>' + k.id + ' <span class="st ' + (k.auto ? 'st--ok' : 'st--warn') + '">' + (k.auto ? 'AUTO' : 'MANUAL') + '</span></h3>' +
      '<div class="inv" style="gap:8px">' +
      '<div class="inv__row" style="grid-template-columns:1fr auto"><b>robot-arm finish</b><i>' + k.arm + '</i></div>' +
      '<div class="inv__row" style="grid-template-columns:1fr auto"><b>CV QC pass</b><i>' + k.cv + '%</i></div>' +
      '<div class="inv__row" style="grid-template-columns:1fr auto"><b>self-clean cycle</b><i>' + k.clean + '</i></div>' +
      '<div class="inv__row" style="grid-template-columns:1fr auto"><b>orders today</b><i>' + k.orders + '</i></div>' +
      '</div>' +
      '<div style="margin-top:12px;display:flex;gap:8px"><button class="mini" data-kio="' + i + '">' + (k.auto ? 'Switch to manual' : 'Enable auto-mode') + '</button>' +
      '<button class="mini" data-kioinc="' + i + '">Log incident</button></div></div>').join('');
    $$('#kioskFleet [data-kio]').forEach(b => b.addEventListener('click', () => {
      const k = KIOSKS[+b.dataset.kio]; k.auto = !k.auto;
      toast(k.id + ' → ' + (k.auto ? 'AUTO (audit-log)' : 'MANUAL override'));
      renderKiosks();
    }));
    $$('#kioskFleet [data-kioinc]').forEach(b => b.addEventListener('click', () => toast('Incident paged to manager on duty (SLA 15 min)')));
  }

  function renderCustomers() {
    $('#kpiCust').innerHTML =
      '<div class="kpi"><i>Members</i><b class="num">' + fmt(3412 + rd('nb-club').length) + '</b><u class="up">▲ 214 this week</u></div>' +
      '<div class="kpi"><i>Active 30d</i><b class="num">1,876</b><u class="fl">55% of base</u></div>' +
      '<div class="kpi"><i>Repeat rate</i><b class="num">38%</b><u class="up">▲ 4 pts</u></div>' +
      '<div class="kpi kpi--gold"><i>QR scans</i><b class="num">1,240</b><u class="fl">cup → CRM</u></div>';
    const realM = rd('nb-club').map(m => ({ n: m.id + ' (new, site)', t: 'Starter', p: m.pts || 0, v: 1, l: 'just now' }));
    const churnRows = CHURN.map(c => ({ n: c.n, t: 'churn risk', p: 0, v: c.v, l: c.last, churn: true }));
    $('#custTable tbody').innerHTML = realM.concat(CUST).concat(churnRows).map(c =>
      '<tr><td><b>' + c.n + '</b></td><td>' + (c.churn ? '<span class="st st--cancel">' + c.t + '</span>' : c.t) + '</td><td class="num">' + c.p + '</td><td class="num">' + c.v + '</td><td>' + c.l + '</td><td>' +
      (c.churn ? '<button class="mini" data-win="' + c.n + '">Winback −20%</button>' : '<button class="mini" data-gift="' + c.n + '">Gift 50 pts</button>') + '</td></tr>'
    ).join('');
    $$('#custTable [data-win]').forEach(b => b.addEventListener('click', () => toast('Winback offer −20% sent to ' + b.dataset.win + ' (WhatsApp + push)')));
    $$('#custTable [data-gift]').forEach(b => b.addEventListener('click', () => toast('50 points gifted to ' + b.dataset.gift)));
  }

  function renderLoyalty() {
    $('#kpiLoy').innerHTML =
      '<div class="kpi"><i>Points issued 14d</i><b class="num">9,180</b><u class="up">▲ 18%</u></div>' +
      '<div class="kpi"><i>Redeemed</i><b class="num">4,670</b><u class="fl">51% burn</u></div>' +
      '<div class="kpi"><i>Free cups given</i><b class="num">96</b><u class="fl">cost 12,480 EGP</u></div>' +
      '<div class="kpi kpi--gold"><i>Referrals</i><b class="num">214</b><u class="up">▲ 32%</u></div>' +
      '<div class="kpi"><i>Pass MRR</i><b class="num">' + fmt(1999 * rd('nb-pass').length) + '<small>EGP</small></b><u class="up">' + rd('nb-pass').length + ' subscriptions</u></div>';
    $('#refStats').innerHTML =
      '<div class="inv__row" style="grid-template-columns:150px 1fr auto"><b>Links sent</b><div class="bar"><span style="width:82%"></span></div><i class="num">612</i></div>' +
      '<div class="inv__row" style="grid-template-columns:150px 1fr auto"><b>Friends converted</b><div class="bar"><span style="width:35%"></span></div><i class="num">214</i></div>' +
      '<div class="inv__row" style="grid-template-columns:150px 1fr auto"><b>Free sauces claimed</b><div class="bar"><span style="width:29%"></span></div><i class="num">178</i></div>' +
      '<p class="note">Mechanic: buddy gets FREE SAUCE, referrer gets 50 pts. CAC via referral ≈ 6 EGP vs 41 EGP paid social.</p>';
  }

  function renderMarketing() {
    $('#campCards').innerHTML = CAMPS.map(c =>
      '<div class="panel"><h3>' + c.n + '</h3><p class="note" style="margin-bottom:12px">' + c.k + '</p>' +
      '<div style="display:flex;gap:22px;flex-wrap:wrap"><div><i class="note">REACH</i><br><b class="num" style="font-size:20px">' + c.reach + '</b></div>' +
      '<div><i class="note">CTR / RATE</i><br><b class="num" style="font-size:20px">' + c.ctr + '</b></div>' +
      '<div><i class="note">ROAS</i><br><b class="num" style="font-size:20px;color:var(--gold-lt)">' + c.roas + '</b></div></div></div>'
    ).join('');
    const sc = rd('nb-scans').length, jb = rd('nb-club').length, rf = rd('nb-ref').length;
    const ug = rd('nb-ugc').length, gf = rd('nb-gifts').length;
    $('#campCards').insertAdjacentHTML('beforeend',
      '<div class="panel"><h3>Negatives & fatigue</h3>' +
      '<div style="display:flex;gap:20px;flex-wrap:wrap">' +
      '<div><i class="note">UNFOLLOWS / WK</i><br><b class="num" style="font-size:20px;color:var(--red)">214</b></div>' +
      '<div><i class="note">AD FREQUENCY</i><br><b class="num" style="font-size:20px;color:#F2CE72">3.8</b><br><i class="note">cap 4 — rotate creatives</i></div>' +
      '<div><i class="note">UGC REJECTED (no rights)</i><br><b class="num" style="font-size:20px">7</b></div>' +
      '<div><i class="note">SPAM REPORTS</i><br><b class="num" style="font-size:20px">2</b></div></div>' +
      '<p class="note" style="margin-top:12px">Creative rotation due: Shatta pour (freq 4.6, CTR −0.8 pp wk/wk).</p></div>');
    $('#campCards').insertAdjacentHTML('beforeend',
      '<div class="panel"><h3>Community loop</h3><p class="note" style="margin-bottom:10px">live from site data-layer</p>' +
      '<div style="display:flex;gap:20px;flex-wrap:wrap"><div><i class="note">UGC SUBMITTED</i><br><b class="num" style="font-size:20px">' + ug + '</b></div>' +
      '<div><i class="note">GIFT CARDS</i><br><b class="num" style="font-size:20px">' + gf + '</b></div>' +
      '<div><i class="note">JOB APPS</i><br><b class="num" style="font-size:20px">' + rd('nb-apps').length + '</b></div></div></div>');
    const cr = $('#crGen');
    if (cr) cr.onclick = () => {
      const city = $('#crCity').value, hook = $('#crHook').value;
      const H = {
        taste: ['One bite. You are in.', 'السقة الحقيقية مش بتتصور.. بتتذاق.', 'Garlic first. Questions later.'],
        price: ['145 EGP. Whole mood.', 'كوب كامل بمشروب.. بسعر تاكسي.', 'Lunch sorted for 145.'],
        culture: ['Born by the Nile. Served on your street.', 'من النيل ليدك.. نفس الحكاية.', 'Egypt invented street food. We just packaged it.']
      };
      const guards = ['logo clearspace ✓', 'no surge pricing ✓', 'AR Egyptian register ✓', 'allergen link present ✓'];
      $('#crOut').innerHTML = H[hook].map((t, i) =>
        '<div class="feed__row"><b>V' + (i + 1) + '</b><span>' + city + ': “' + t + '”</span>' +
        '<span style="display:flex;gap:4px"><i style="width:12px;height:12px;border-radius:3px;background:#E0A72C;display:inline-block"></i><i style="width:12px;height:12px;border-radius:3px;background:#C4562A;display:inline-block"></i><i style="width:12px;height:12px;border-radius:3px;background:#0B0906;border:1px solid #333;display:inline-block"></i></span>' +
        '<button class="mini" data-cr="' + (i + 1) + '">Approve</button></div>').join('') +
        '<p class="note">brand-guard: ' + guards.join(' · ') + ' · human approve required (BRANDBOOK §10)</p>';
      $$('#crOut [data-cr]').forEach(b => b.onclick = () => { writeLSAdmin('nb-creatives', { v: city + '/' + hook + '/V' + b.dataset.cr, ts: Date.now() }); toast('Creative V' + b.dataset.cr + ' approved → content calendar'); });
    };
    funnel($('#chartFunnel'), [
      { label: 'Cups scanned', v: 1240 + sc + jb }, { label: 'Rated their bite', v: 618 + sc },
      { label: 'Joined Nile Club', v: 402 + jb }, { label: 'Referred a buddy', v: 96 + rf }
    ]);
  }

  function renderAnalytics() {
    $('#kpiAna').innerHTML =
      '<div class="kpi"><i>Repeat rate</i><b class="num">38%</b><u class="up">▲ 4 pts MoM</u></div>' +
      '<div class="kpi"><i>Retention W4</i><b class="num">27%</b><u class="up">▲ 3 pts</u></div>' +
      '<div class="kpi"><i>CAC blended</i><b class="num">29<small>EGP</small></b><u class="dn">▼ 6 EGP</u></div>' +
      '<div class="kpi kpi--gold"><i>LTV / CAC</i><b class="num">4.6×</b><u class="up">healthy &gt; 3×</u></div>';
    area($('#chartCheck'), CHECK30, { labels: CHECK30.map((_, i) => (i % 7 === 0 ? 'd' + (i + 1) : null)) });
    donut2();
    const coh = [['Cohort', 'W1', 'W2', 'W3', 'W4'], ['Aug W1', 100, 41, 33, 27], ['Aug W3', 100, 44, 35, 29], ['Sep W1', 100, 47, 38, 0], ['Sep W3', 100, 52, 0, 0]];
    $('#cohort').innerHTML = '<table><thead><tr>' + coh[0].map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
      coh.slice(1).map(r => '<tr><td><b>' + r[0] + '</b></td>' + r.slice(1).map(v =>
        '<td><span class="st" style="background:rgba(224,167,44,' + (v ? v / 130 : 0) + ');color:' + (v > 30 ? '#0B0906' : 'var(--mut)') + '">' + (v || '—') + (v ? '%' : '') + '</span></td>').join('') + '</tr>').join('') +
      '</tbody></table>';
    function donut2() {
      const svg = $('#chartChan');
      const cx = 110, cy = 110, r = 70, C = 2 * Math.PI * r;
      let off = 0, g = '';
      CHANNELS.forEach(it => {
        const len = C * it.v / 100;
        g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + it.c + '" stroke-width="24" stroke-dasharray="' + len + ' ' + (C - len) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
        off += len;
      });
      CHANNELS.forEach((it, i) => {
        const y = 40 + i * 26;
        g += '<rect x="198" y="' + (y - 9) + '" width="10" height="10" rx="3" fill="' + it.c + '"/>';
        g += '<text x="214" y="' + y + '" font-family="Arial,Archivo" font-size="11" fill="rgba(245,239,224,.75)" font-weight="700">' + it.name + '</text>';
        g += '<text x="296" y="' + y + '" font-family="Archivo" font-size="11" fill="rgba(245,239,224,.5)" text-anchor="end" font-weight="800">' + it.v + '%</text>';
      });
      svg.innerHTML = g;
    }
  }

  function renderFranchise() {
    $('#kpiFr').innerHTML =
      '<div class="kpi"><i>Leads 30d</i><b class="num">38</b><u class="up">▲ 9</u></div>' +
      '<div class="kpi"><i>Qualified</i><b class="num">11</b><u class="fl">29% of leads</u></div>' +
      '<div class="kpi"><i>Deck sent</i><b class="num">37</b><u class="fl">gate conversion 74%</u></div>' +
      '<div class="kpi kpi--gold"><i>Discovery calls</i><b class="num">4</b><u class="up">2 this week</u></div>';
    let stages = {};
    try { stages = JSON.parse(localStorage.getItem('nb-leadstage') || '{}'); } catch (e) {}
    const real = rd('nb-leads').map(l => {
      const d = new Date(l.ts);
      return { n: l.name + ' ⚡', c: l.city, b: l.range || '—', s: stages[l.email] || 'New', d: d.getDate() + ' ' + d.toLocaleString('en', { month: 'short' }), em: l.email, live: true };
    });
    const leads = real.concat(LEADS);
    $('#kpiFr').firstElementChild.querySelector('b').textContent = 38 + real.length;
    $('#leadTable tbody').innerHTML = leads.map(l =>
      '<tr><td><b>' + l.n + '</b></td><td>' + l.c + '</td><td>' + l.b + '</td>' +
      '<td><select class="leadsel" data-lead="' + l.n + '"' + (l.em ? ' data-em="' + l.em + '"' : '') + '>' + ['New', 'Qualified', 'Call booked', 'Deck sent', 'Discovery', 'Paused'].map(st => '<option' + (st === l.s ? ' selected' : '') + '>' + st + '</option>').join('') + '</select></td>' +
      '<td class="num">' + l.d + '</td></tr>'
    ).join('');
    $$('#leadTable [data-lead]').forEach(sl => sl.addEventListener('change', () => {
      if (sl.dataset.em) {
        try {
          const st = JSON.parse(localStorage.getItem('nb-leadstage') || '{}');
          st[sl.dataset.em] = sl.value;
          localStorage.setItem('nb-leadstage', JSON.stringify(st));
        } catch (e) {}
      }
      toast(sl.dataset.lead + ' → ' + sl.value);
    }));
    $('#deckCount').textContent = 37 + rd('nb-deck').length;
    $('#kpiFr').children[2].querySelector('b').textContent = 37 + rd('nb-deck').length;
  }

  function renderSalesCharts() {
    const f = S.range === 'today' ? 1 : S.range === '7d' ? 6.4 : 26.1;
    area($('#chartHours'), HOUR_VAL.map(v => v * f), { labels: HOURS.map((h, i) => (i % 3 === 0 ? h + ':00' : null)) });
    donut($('#chartSauce'), SAUCES);
    hbars($('#chartProd'), P.map(p => ({ name: p.name, v: p.sold * p.price * f, c: p.id === 'shawarma' ? '#E0A72C' : 'rgba(224,167,44,.45)', suf: '' })));
  }

  function renderKDS() {
    const live = S.orders.filter(o => o.st === 'new' || o.st === 'prep');
    $('#cntKds').textContent = live.length;
    const now = Date.now();
    const waits = live.map(o => (now - (o.ts || now)) / 60000);
    const avg = waits.length ? waits.reduce((a, b) => a + b, 0) / waits.length : 0;
    const breach = live.filter(o => (now - (o.ts || now)) / 60000 > 12).length;
    $('#kpiKds').innerHTML =
      '<div class="kpi"><i>In queue</i><b class="num">' + live.length + '</b><u class="fl">new + preparing</u></div>' +
      '<div class="kpi"><i>Avg wait</i><b class="num">' + avg.toFixed(1) + '<small>min</small></b><u class="' + (avg > 8 ? 'dn' : 'up') + '">target &lt; 6</u></div>' +
      '<div class="kpi ' + (breach ? 'kpi--red' : '') + '"><i>Breaching now</i><b class="num">' + breach + '</b><u class="dn">&gt; 12 min = SLA</u></div>' +
      '<div class="kpi"><i>Passed today</i><b class="num">' + S.orders.filter(o => o.st === 'done' || o.st === 'ready').length + '</b><u class="fl">to counter / courier</u></div>';
    $('#kdsBoard').innerHTML = live.sort((a, b) => (a.ts || 0) - (b.ts || 0)).map(o => {
      const el = (now - (o.ts || now)) / 60000;
      const tc = el > 12 ? 't-bad' : el > 8 ? 't-warn' : 't-ok';
      return '<div class="kds__card' + (el > 12 ? ' kds--breach' : '') + '">' +
        '<div class="kds__top"><b>' + o.id + '</b><span class="st st--' + o.st + '">' + ST_LABEL[o.st] + '</span>' +
        '<span class="kds__time ' + tc + '" data-ts="' + (o.ts || now) + '">0:00</span></div>' +
        '<div class="kds__items">' + o.items + '<br>' + o.ch + ' · ' + o.total + ' EGP</div>' +
        '<div class="kds__btns">' + (o.st === 'new' ? '<button class="mini" data-kds="' + o.id + '">Bump → cooking</button>' : '<button class="mini" data-kds="' + o.id + '">Fire → counter</button>') + '</div></div>';
    }).join('') || '<p class="note">Queue is empty — kitchen is catching breath.</p>';
    $$('#kdsBoard [data-kds]').forEach(b => b.addEventListener('click', () => {
      const o = S.orders.find(x => x.id === b.dataset.kds);
      o.st = o.st === 'new' ? 'prep' : 'ready';
      toast(o.id + ' → ' + ST_LABEL[o.st]);
      renderKDS(); renderOrders();
    }));
    tickKds();
  }
  function tickKds() {
    $$('#kdsBoard .kds__time').forEach(t => {
      const el = (Date.now() - parseInt(t.dataset.ts, 10)) / 60000;
      const mm = Math.floor(el), ss = Math.floor((el - mm) * 60);
      t.textContent = mm + ':' + String(ss).padStart(2, '0');
      t.className = 'kds__time ' + (el > 12 ? 't-bad' : el > 8 ? 't-warn' : 't-ok');
      t.closest('.kds__card').classList.toggle('kds--breach', el > 12);
    });
  }
  setInterval(() => { if (S.sec === 'kds') tickKds(); }, 1000);

  const AI_CHURN = [
    { n: 'Omar El-Sayed', risk: 12, ltv: 2140, act: 'none — healthy' },
    { n: 'Lena Fischer', risk: 34, ltv: 980, act: 'soft nudge: new sauce drop' },
    { n: 'Karim F.', risk: 78, ltv: 1460, act: 'winback −20% (WA template A)' },
    { n: 'Sofia M.', risk: 71, ltv: 640, act: 'winback free topping' },
    { n: 'Tarek H.', risk: 64, ltv: 1890, act: 'personal offer: 18-cup price' }
  ];
  const AI_WASTE = [ { name: 'Cheese & Herb', v: 7.2 }, { name: 'Nile Shrimp', v: 6.1 }, { name: 'Shatta Beef', v: 3.8 }, { name: 'Chicken Shawarma', v: 2.4 }, { name: 'Beef Kofta', v: 1.9 } ];
  const AI_PO = [
    { id: 'PO-771', txt: 'cheese −20% prep tomorrow (forecast 7.2% waste)', save: '310 EGP' },
    { id: 'PO-772', txt: 'shrimp order −8 kg, swap promo to Fri', save: '540 EGP' }
  ];
  const AI_CV = [
    { id: 'NB-1046', fill: 96, garn: 'ok', steam: 'ok', st: 'pass' },
    { id: 'NB-1050', fill: 88, garn: 'low herbs', steam: 'ok', st: 'flag' },
    { id: 'NB-1052', fill: 94, garn: 'ok', steam: 'low', st: 'flag' },
    { id: 'NB-1044', fill: 97, garn: 'ok', steam: 'ok', st: 'pass' }
  ];
  const AI_TWIN = [4, 6, 9, 14, 19, 24, 22, 17, 12, 8, 6, 5];

  function renderAI() {
    $('#kpiAi').innerHTML =
      '<div class="kpi"><i>Forecast accuracy</i><b class="num">91%</b><u class="up">MAPE 9% · 30d</u></div>' +
      '<div class="kpi"><i>Waste prevented</i><b class="num">8,420<small>EGP</small></b><u class="up">this month via Smart Save</u></div>' +
      '<div class="kpi kpi--red"><i>Churn flagged</i><b class="num">3</b><u class="dn">risk >60% · actions queued</u></div>' +
      '<div class="kpi"><i>CV QC pass</i><b class="num">96%</b><u class="fl">4% re-garnished pre-pass</u></div>';
    $('#aiChurn tbody').innerHTML = AI_CHURN.map(m =>
      '<tr><td><b>' + m.n + '</b></td><td><span class="score ' + (m.risk > 60 ? 'score--hi' : m.risk > 30 ? 'score--md' : 'score--lo') + '">' + m.risk + '%</span></td>' +
      '<td class="num">' + fmt(m.ltv) + ' EGP</td><td>' + m.act + '</td></tr>').join('');
    const svg = $('#aiWaste'); const max = 8;
    svg.innerHTML = AI_WASTE.map((it, i) => {
      const y = 12 + i * 36, w = 400 * it.v / max;
      return '<text x="0" y="' + (y + 12) + '" fill="rgba(245,239,224,.72)" font-size="12" font-family="Archivo" font-weight="700">' + it.name + '</text>' +
        '<rect x="180" y="' + y + '" width="400" height="15" rx="7" fill="rgba(245,239,224,.07)"/>' +
        '<rect x="180" y="' + y + '" width="' + Math.max(5, w) + '" height="15" rx="7" fill="' + (it.v > 5 ? '#F08A72' : it.v > 3 ? '#E0A72C' : '#3FA98A') + '"/>' +
        '<text x="' + (185 + Math.max(5, w)) + '" y="' + (y + 12) + '" fill="rgba(245,239,224,.6)" font-size="11" font-family="Archivo" font-weight="800"> ' + it.v + '%</text>';
    }).join('');
    const approved = JSON.parse(localStorage.getItem('nb-po') || '[]');
    $('#poList').innerHTML = AI_PO.map(po =>
      '<div class="feed__row"><b>' + po.id + '</b><span>' + po.txt + '</span><span class="sum">save ' + po.save + '</span>' +
      '<button class="mini" data-po="' + po.id + '"' + (approved.indexOf(po.id) > -1 ? ' disabled' : '') + '>' + (approved.indexOf(po.id) > -1 ? 'approved' : 'Approve PO') + '</button></div>').join('');
    $$('#poList [data-po]').forEach(b => b.addEventListener('click', () => {
      writeLSAdmin('nb-po', { id: b.dataset.po, ts: Date.now() });
      toast(b.dataset.po + ' approved → supplier webhook (concept)');
      renderAI();
    }));
    $('#aiCv').innerHTML = AI_CV.map(c =>
      '<div class="feed__row"><b>' + c.id + '</b><span>fill ' + c.fill + '% · ' + c.garn + ' · steam ' + c.steam + '</span>' +
      '<span class="st ' + (c.st === 'pass' ? 'st--ok' : 'st--warn') + '">' + c.st + '</span></div>').join('');
    const t = $('#aiTwin'); const mx = Math.max.apply(null, AI_TWIN);
    t.innerHTML = AI_TWIN.map((v, i) => {
      const x = 20 + i * 52, h = (v / mx) * 150;
      return '<rect x="' + x + '" y="' + (180 - h) + '" width="34" height="' + h + '" rx="6" fill="' + (v >= 19 ? '#E0A72C' : 'rgba(224,167,44,.35)') + '"/>' +
        '<text x="' + (x + 17) + '" y="196" text-anchor="middle" font-size="9" fill="rgba(245,239,224,.45)" font-family="Archivo">' + (18 + Math.floor(i / 4)) + ':' + (i % 4) * 15 + '</text>';
    }).join('');
    $('#twinNote').textContent = 'Sim: +1 crew 19:00-21:00 cuts projected wait 14→7 min (SLA safe). Decision stays with the manager — audit-logged.';
    const STAFF = [
      ['Sat', 410, 9, 10, '+1'], ['Sun', 355, 8, 9, '+1'], ['Mon', 240, 7, 6, '−1'],
      ['Tue', 235, 7, 6, '−1'], ['Wed', 260, 7, 7, '0'], ['Thu', 300, 8, 8, '0'], ['Fri', 380, 9, 9, '0']
    ];
    $('#aiStaff tbody').innerHTML = STAFF.map(r =>
      '<tr><td><b>' + r[0] + '</b></td><td class="num">' + r[1] + '</td><td class="num">' + r[2] + '</td><td class="num">' + r[3] + '</td>' +
      '<td><span class="score ' + (r[4] === '0' ? 'score--lo' : r[4].indexOf('+') === 0 ? 'score--md' : 'score--hi') + '">' + r[4] + '</span></td></tr>').join('');
    $('#rosterBtn').onclick = () => toast('Roster approved by manager — audit-log entry created (human-in-the-loop rule)');
  }
  function writeLSAdmin(key, rec) {
    try { const all = JSON.parse(localStorage.getItem(key) || '[]'); all.unshift(rec); localStorage.setItem(key, JSON.stringify(all.slice(0, 80))); } catch (e) {}
  }

  function renderRisk() {
    const openC = COMPLAINTS.filter(c => c.st === 'open').length;
    $('#cntRisk').textContent = openC + SLA_BREACH.filter(x => x.st === 'open').length;
    $('#kpiRisk').innerHTML =
      '<div class="kpi kpi--red"><i>Cancellations</i><b class="num">14</b><u class="dn">3.2% of orders · target &lt;2%</u></div>' +
      '<div class="kpi kpi--red"><i>Refunds today</i><b class="num">425<small>EGP</small></b><u class="dn">3 cases</u></div>' +
      '<div class="kpi kpi--red"><i>Waste</i><b class="num">4.1%</b><u class="dn">of produced · target &lt;3%</u></div>' +
      '<div class="kpi kpi--red"><i>Open complaints</i><b class="num">' + openC + '</b><u class="dn">from QR scans 1–2★</u></div>' +
      '<div class="kpi"><i>SLA breaches</i><b class="num">6</b><u class="dn">peak 19–21h · wait &gt;12 min</u></div>' +
      '<div class="kpi"><i>Payment fails</i><b class="num">4</b><u class="fl">2 recovered via WA</u></div>';
    $('#riskFeed').innerHTML =
      COMPLAINTS.filter(c => c.st === 'open').map(c =>
        '<div class="feed__row"><b>' + c.id + '</b><span>★' + c.stars + ' ' + c.sku + ': ' + c.txt + '</span><span class="t">' + c.t + '</span><button class="mini" data-res="' + c.id + '">Resolve</button></div>').join('') +
      SLA_BREACH.filter(x => x.st === 'open').map(x =>
        '<div class="feed__row"><b>' + x.id + '</b><span>wait ' + x.wait + ' — SLA breach</span><span class="t">peak</span><button class="mini" data-res="' + x.id + '">Compensate</button></div>').join('') +
      '<div class="feed__row"><b>STOCK</b><span>cheese sold-out 40 min at peak</span><span class="t">19:35</span><button class="mini" data-res="STOCK">Fix order</button></div>';
    $$('#riskFeed [data-res]').forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.res;
      const c = COMPLAINTS.find(x => x.id === id); if (c) c.st = 'resolved';
      const sl = SLA_BREACH.find(x => x.id === id); if (sl) sl.st = 'compensated';
      toast(id + ' → action logged (refund/offer + root-cause note)');
      renderRisk();
    }));
    hbarsWaste();
    $('#refTable tbody').innerHTML = REFUNDS.map(r =>
      '<tr><td><b>' + r.id + '</b></td><td class="num">' + r.sum + ' EGP</td><td>' + r.why + '</td><td><span class="st ' + (r.res === 'refunded' ? 'st--cancel' : 'st--warn') + '">' + r.res + '</span></td></tr>').join('');
    $('#churnList').innerHTML = CHURN.map(c =>
      '<div class="inv__row" style="grid-template-columns:1fr auto auto"><b>' + c.n + ' <i>· ' + c.v + ' visits · last ' + c.last + '</i></b>' +
      '<div class="bar"><span class="low" style="width:' + Math.max(8, 40 - c.v * 2) + '%"></span></div>' +
      '<button class="mini" data-win2="' + c.n + '">Winback</button></div>').join('');
    $$('#churnList [data-win2]').forEach(b => b.addEventListener('click', () => toast('Winback flow started for ' + b.dataset.win2)));
    function hbarsWaste() {
      const svg = $('#chartWaste');
      const max = 8;
      svg.innerHTML = WASTE.map((it, i) => {
        const y = 14 + i * 40, w = 430 * it.v / max;
        return '<text x="0" y="' + (y + 12) + '" fill="rgba(245,239,224,.72)" font-size="12" font-family="Archivo" font-weight="700">' + it.name + '</text>' +
          '<rect x="170" y="' + y + '" width="430" height="16" rx="8" fill="rgba(245,239,224,.07)"/>' +
          '<rect x="170" y="' + y + '" width="' + Math.max(5, w) + '" height="16" rx="8" fill="' + (it.v > 5 ? '#F08A72' : it.v > 3 ? '#E0A72C' : '#3FA98A') + '"/>' +
          '<text x="' + (170 + Math.max(5, w) + 10) + '" y="' + (y + 12) + '" fill="rgba(245,239,224,.6)" font-size="11.5" font-family="Archivo" font-weight="800">' + it.v + '%</text>';
      }).join('');
    }
  }

  const RENDER = {
    sales() { salesKpis(); renderSalesCharts(); renderFeed(); },
    orders: renderOrders, kds: renderKDS, risk: renderRisk, products: renderProducts, inventory: renderInv, stores: renderStores,
    customers: renderCustomers, loyalty() { renderLoyalty(); area2(); function area2() { const svg = $('#chartLoy'); area(svg, LOY_ISS, { labels: LOY_ISS.map((_, i) => (i % 3 === 0 ? 'd' + (i + 1) : null)) }); const g = svg.innerHTML; area(svg, LOY_ISS, {}); svg.innerHTML = g + overlay(svg); function overlay(s) { const W = 640, H = 220, PL = 34, PR = 12, PT = 14, PB = 26; const vals = LOY_RED; const max = Math.max.apply(null, LOY_ISS) * 1.15; const x = i => PL + i * (W - PL - PR) / (vals.length - 1); const y = v => PT + (1 - v / max) * (H - PT - PB); let d = ''; vals.forEach((v, i) => { d += (i ? 'L' : 'M') + x(i).toFixed(1) + ',' + y(v).toFixed(1); }); return '<path d="' + d + '" fill="none" stroke="#3FA98A" stroke-width="2.4" stroke-dasharray="5 5"/>'; } } },
    ai: renderAI, marketing: renderMarketing, analytics: renderAnalytics, franchise: renderFranchise
  };

  function go(sec) {
    S.sec = sec;
    $$('.side button[data-sec]').forEach(b => b.classList.toggle('is-on', b.dataset.sec === sec));
    $$('.sec').forEach(s => s.classList.toggle('is-on', s.id === 'sec-' + sec));
    $('#admTitle').textContent = TITLES[sec];
    document.body.classList.remove('side-open');
    (RENDER[sec] || function () {})();
  }
  $$('.side button[data-sec]').forEach(b => b.addEventListener('click', () => go(b.dataset.sec)));
  $('#burger').addEventListener('click', () => document.body.classList.toggle('side-open'));

  /* ------------------------------------------------------------ topbar */
  $('#range').addEventListener('change', e => { S.range = e.target.value; if (S.sec === 'sales') RENDER.sales(); else go('sales'); });
  $('#liveBtn').addEventListener('click', () => {
    S.live = !S.live;
    $('#liveBtn').classList.toggle('is-paused', !S.live);
    $('#liveTxt').textContent = S.live ? 'LIVE' : 'PAUSED';
    $('#feedTag').textContent = S.live ? 'streaming' : 'paused';
  });
  $('#exportBtn').addEventListener('click', () => {
    const rows = [['order', 'time', 'items', 'channel', 'total_egp', 'status']]
      .concat(S.orders.map(o => [o.id, o.time, o.items, o.ch, o.total, o.st]));
    const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'nile-orders-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click(); URL.revokeObjectURL(a.href);
    toast('CSV exported · ' + S.orders.length + ' orders');
  });
  $('#dataExport').addEventListener('click', () => {
    const dump = {};
    ['nb-orders', 'nb-leads', 'nb-deck', 'nb-scans', 'nb-ref', 'nb-club', 'nb-ugc', 'nb-gifts', 'nb-apps', 'nb-leadstage'].forEach(k => {
      try { dump[k] = JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { dump[k] = null; }
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' }));
    a.download = 'nile-data-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click(); URL.revokeObjectURL(a.href);
    toast('Data-layer exported as JSON');
  });
  $('#dataReset').addEventListener('click', () => {
    ['nb-orders', 'nb-leads', 'nb-deck', 'nb-scans', 'nb-ref', 'nb-club', 'nb-ugc', 'nb-gifts', 'nb-apps', 'nb-leadstage', 'nb-consent', 'nb-cup'].forEach(k => localStorage.removeItem(k));
    toast('Demo data reset');
    setTimeout(() => location.reload(), 700);
  });
  $('#ordSearch').addEventListener('input', e => { S.q = e.target.value.trim().toLowerCase(); renderOrders(); });
  $$('#ordFilters button').forEach(b => b.addEventListener('click', () => {
    $$('#ordFilters button').forEach(x => x.classList.toggle('is-on', x === b));
    S.f = b.dataset.f; renderOrders();
  }));
  $('#poBtn').addEventListener('click', () => toast('Purchase order drafted: cheese +20 kg, garlic sauce +15 L'));
  $('#countBtn').addEventListener('click', () => toast('Stock count scheduled: Sun 06:00'));

  /* ------------------------------------------------------------ live stream */
  setInterval(() => {
    if (!S.live) return;
    S.orders.unshift(makeOrder(0));
    if (S.orders.length > 60) S.orders.pop();
    $('#cntNew').textContent = S.orders.filter(o => o.st === 'new').length;
    if (S.sec === 'sales') renderFeed();
    if (S.sec === 'orders') renderOrders();
  }, 5000);

  go('sales');
})();
