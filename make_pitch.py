#!/usr/bin/env python3
"""
Nile Bites — Investor One-Pager + Pitch Deck generator (pure python).
Outputs: franchise-kit/NileBites-Investor-OnePager.pdf (1 p.)
         franchise-kit/NileBites-Pitch-Deck.pdf (12 p.)
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
KIT = os.path.join(ROOT, 'franchise-kit')
W, H = 842, 595
BLACK = (0.043, 0.035, 0.024); GOLD = (0.878, 0.655, 0.173); GOLDL = (0.949, 0.808, 0.447)
CREAM = (0.961, 0.937, 0.878); TERRA = (0.886, 0.439, 0.227); MUT = (0.62, 0.58, 0.52)
GREEN = (0.435, 0.827, 0.659); RED = (0.94, 0.54, 0.44); CARD = (0.09, 0.07, 0.05)


def esc(t):
    t = t.replace('\u2014', '-').replace('\u2013', '-').replace('\u2018', "'").replace('\u2019', "'")
    t = t.replace('`', "'").replace('\u2022', '-')
    return t.replace('\\', r'\\').replace('(', r'\(').replace(')', r'\)')


class Page:
    def __init__(self): self.c = []
    def rect(self, x, y, w, h, col): self.c.append('%f %f %f rg %f %f %f %f re f' % (col[0], col[1], col[2], x, y, w, h))
    def text(self, x, y, t, size=11, col=CREAM, font='R'):
        f = {'B': 'F1', 'I': 'F2', 'R': 'F3'}[font]
        self.c.append('BT /%s %f Tf %f %f %f rg %f %f Td (%s) Tj ET' % (f, size, col[0], col[1], col[2], x, y, esc(t)))
    def stream(self): return '\n'.join(self.c).encode('latin-1', 'replace')


def base(p):
    p.rect(0, 0, W, H, BLACK)
    p.line = None
    p.rect(48, H - 96, 60, 3, GOLD)
    p.text(48, H - 84, 'N I L E   B I T E S', 9, GOLD, 'B')
    p.text(W - 48 - 210, H - 84, 'INVESTOR MATERIALS - 2026 - CONFIDENTIAL', 8, MUT, 'I')
    p.rect(48, 40, W - 96, 0.8, (0.2, 0.17, 0.13))
    p.text(48, 26, 'nilebites.com - hello@nilebites.com', 8, MUT)


def title(p, kick, t1, t2=None):
    p.text(48, H - 140, kick, 10, TERRA, 'B')
    p.text(48, H - 178, t1, 32, CREAM, 'B')
    if t2: p.text(48, H - 210, t2, 32, GOLD, 'B')


def bullets(p, x, y, items, size=10.5, lead=18, col=CREAM):
    for i, it in enumerate(items):
        p.rect(x, y - i * lead - size + 3, 5, 5, GOLD)
        p.text(x + 13, y - i * lead, it, size, col)


def kpi_strip(p, items, y=250, h=110):
    x = 48
    w = (W - 96 - 14 * (len(items) - 1)) / len(items)
    for t, v, note, col in items:
        p.rect(x, y, w, h, CARD)
        p.text(x + 14, y + h - 26, t, 8.5, MUT)
        p.text(x + 14, y + h - 56, v, 22, col, 'B')
        p.text(x + 14, y + 16, note, 8, MUT, 'I')
        x += w + 14


def assemble(pages, path):
    objs = [b'<</Type/Catalog/Pages 2 0 R>>',
            ('<</Type/Pages/Kids[%s]/Count %d>>' % (' '.join('%d 0 R' % (3 + i * 2) for i in range(len(pages))), len(pages))).encode()]
    nf = 3 + 2 * len(pages) + 1
    for i, pg in enumerate(pages):
        st = pg.stream()
        objs.append(('<</Type/Page/Parent 2 0 R/MediaBox[0 0 %d %d]/Resources<</Font<</F1 %d 0 R /F2 %d 0 R /F3 %d 0 R>>>>/Contents %d 0 R>>' % (W, H, nf, nf + 1, nf + 2, 4 + i * 2)).encode())
        objs.append(b'<</Length %d>>\nstream\n%b\nendstream' % (len(st), st))
    objs.append(b'<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>')
    objs.append(b'<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Oblique>>')
    objs.append(b'<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>')
    out = b'%PDF-1.4\n'; offs = []
    for i, o in enumerate(objs, 1):
        offs.append(len(out)); out += b'%d 0 obj\n%b\nendobj\n' % (i, o)
    x = len(out)
    out += b'xref\n0 %d\n0000000000 65535 f \n' % (len(objs) + 1)
    for o in offs: out += b'%010d 00000 n \n' % o
    out += b'trailer\n<</Size %d/Root 1 0 R>>\nstartxref\n%d\n%%%%EOF' % (len(objs) + 1, x)
    open(path, 'wb').write(out)
    print('written:', os.path.basename(path), '%.0f KB' % (len(out) / 1024), 'pages:', len(pages))


# ============================================================ ONE-PAGER
p = Page()
p.rect(0, 0, W, H, BLACK); p.rect(0, H - 12, W, 12, GOLD)
p.text(48, H - 70, 'INVEST IN NILE.', 40, CREAM, 'B')
p.text(48, H - 96, 'Egyptian street food, packaged like a global brand.', 13, GOLD, 'B')
p.text(W - 48 - 150, H - 70, 'ONE-PAGER - 2026', 10, MUT, 'I')
kpi_strip(p, [
    ('ARR RUN-RATE', '12.4M', 'EGP, flagship annualised', GOLDL),
    ('REPEAT RATE', '38%', 'QR-scan CRM measured', CREAM),
    ('AVG CHECK', '114', 'EGP, mix of sizes', CREAM),
    ('GROSS MARGIN', '63%', 'food+pack 37%', GREEN),
    ('EBITDA MARGIN', '22%', 'store level, mature', GREEN),
    ('PAYBACK', '3-8', 'months per point', GOLDL),
], y=H - 230, h=100)
y = H - 268
p.text(48, y, 'WHY NOW', 11, TERRA, 'B')
bullets(p, 48, y - 24, [
    'Egypt online food delivery: USD 543M (2025), growing - duopoly platforms own the customer; brands do not.',
    'Street food is the culture, but no modern Egyptian brand packages it for scale - the Zooba gap, in cup format.',
    'Every cup carries a QR: owned CRM from day one - scans, repeat, referrals, ratings - no platform rent on data.',
    'Halal-certified central kitchen + 4-minute finish: quality without chefs, capex-light formats (50-150k USD).',
], 10, 17)
p.text(470, y, 'USE OF FUNDS - PRE-SEED 250K USD', 11, TERRA, 'B')
funds = [('Central kitchen #2 (Cairo)', 40), ('2 counters + flagship fit-out', 35), ('Brand, content & launch', 15), ('Tech: ordering, KDS, CRM', 10)]
yy = y - 26
for n, v in funds:
    p.text(470, yy, n, 10, CREAM)
    p.rect(470, yy - 12, 260 * v / 45, 8, GOLD if v >= 35 else TERRA)
    p.text(470 + 260 * v / 45 + 8, yy - 5, '%d%%' % v, 9.5, MUT, 'B')
    yy -= 30
p.rect(48, 96, W - 96, 52, CARD)
p.text(66, 126, 'THE ASK: pre-seed USD 250k for 18 months runway - 2nd cloud kitchen, 2 Cairo counters, path to 10 stores and Series A metrics.', 10.5, CREAM, 'B')
p.text(66, 108, 'Data room (NDA): cohorts, unit economics, scan-CRM funnels. Deck & one-pager: franchise gate on nilebites.com.', 9.5, MUT, 'I')
p.text(48, 26, 'CONFIDENTIAL - not an offer of securities. Numbers are concept-stage model until flagship actuals land.', 8, MUT, 'I')
assemble([p], os.path.join(KIT, 'NileBites-Investor-OnePager.pdf'))

# ============================================================ PITCH DECK
P = []
p = Page(); p.rect(0, 0, W, H, BLACK); p.rect(0, H - 14, W, 14, GOLD)
p.text(48, H - 160, 'NILE', 96, CREAM, 'B'); p.text(48, H - 246, 'BITES', 96, GOLD, 'B')
p.text(50, H - 286, 'EGYPTIAN STREET FOOD. MADE TO GO.', 13, TERRA, 'B')
p.text(48, H - 330, 'PITCH 2026', 20, CREAM, 'B')
p.text(48, H - 352, 'One cup. Many flavours. A brand built to scale.', 11, MUT)
p.text(48, 60, 'CONFIDENTIAL', 8, MUT, 'I'); P.append(p)

p = Page(); base(p); title(p, '01 - PROBLEM', 'GREAT FOOD.', 'NO BRAND OWNS THE STREET.')
bullets(p, 48, H - 260, [
    'Egypt`s street food is culture - but fragmented, unbranded, invisible to tourists and platforms.',
    'Delivery duopoly (talabat/elmenus) owns the customer relationship and takes 20-30% of every order.',
    'Tourists want safe, fast, instagrammable local food; locals want consistency and speed at night.',
    'Existing chains import foreign formats - none sell "Egypt" as a modern food brand.',
]); P.append(p)

p = Page(); base(p); title(p, '02 - INSIGHT', 'THE CUP IS THE PLATFORM.', 'THE QR IS THE CRM.')
bullets(p, 48, H - 260, [
    'One format - hot bites in a clear cup - solves portability, photo-genics and speed (4 min service).',
    'Every cup carries a QR: rate your bite, join Nile Club, refer a buddy - owned first-party data.',
    'Scan CRM answers the investor questions early: repeat rate, channel mix, product quality by SKU.',
    'Brand system (gold-on-black, Nile line, Arabic display type) travels across cups, stores, cities.',
]); P.append(p)

p = Page(); base(p); title(p, '03 - PRODUCT', 'FIVE FILLINGS. FOUR SAUCES.', 'ONE UNFORGETTABLE BITE.')
rows = [('KOFTA 145', 'shawarma 140', 'shatta 150'), ('cheese 125 (veg)', 'nile shrimp 175', 'sizes 8/12/18')]
y = H - 250
for r in rows:
    p.text(48, y, '   '.join(r), 13, CREAM, 'B'); y -= 26
p.text(48, y - 6, 'Sauces: Nile Garlic - Shatta - Tahini - Nile Signature (secret). Allergen matrix + kcal public.', 10.5, MUT)
p.rect(W - 300, 140, 252, 220, CARD)
p.text(W - 280, 330, 'CUP ECONOMICS', 10, GOLD, 'B')
p.text(W - 280, 300, 'food + pack 37%', 12, CREAM)
p.text(W - 280, 278, 'gross margin 63%', 12, GREEN)
p.text(W - 280, 256, 'service 4 min', 12, CREAM)
p.text(W - 280, 234, 'halal 100%', 12, GOLDL)
P.append(p)

p = Page(); base(p); title(p, '04 - BRAND & GO-TO-MARKET', 'CONTENT FIRST.', 'STORE SECOND.')
bullets(p, 48, H - 260, [
    '30-day UGC engine: #MyNileBite wall, rights-granted reposts, micro-KOL barter in resort zones.',
    'WhatsApp ordering with prefilled cup config - conversational commerce where EG actually buys.',
    'Talabat/elmenus as acquisition channels; own site + WA as margin channels; QR as retention.',
    'EN / AR (Egyptian register) / RU tourist layer - the only street brand speaking all three fluently.',
]); P.append(p)

p = Page(); base(p); title(p, '05 - TRACTION MODEL', 'HONEST STAGE:', 'CONCEPT -> FLAGSHIP -> DATA.')
bullets(p, 48, H - 260, [
    'Today: full brand + product concept, production-ready web skeleton, franchise kit, ops playbooks.',
    'Week 6: Hurghada flagship live (production rollout plan signed off, 6-week checklist).',
    'Month 3: first real cohort data - repeat, waste, SLA, scan funnel - replaces model numbers.',
    'Risk dashboard live from day 1: cancellations, refunds, waste, complaints, churn - no vanity metrics.',
]); P.append(p)

p = Page(); base(p); title(p, '06 - UNIT ECONOMICS', 'ONE STORE.', 'MATH THAT TRAVELS.')
kpi_strip(p, [('ORDERS/DAY', '300', 'blended', CREAM), ('AVG CHECK', '114', 'EGP', CREAM), ('REV/MO', '1.03M', 'EGP', GOLDL), ('EBITDA', '22%', 'store level', GREEN)], y=230, h=100)
p.text(48, 200, 'Payback 3-8 months per point; formats: kiosk 50-80k, street store 80-120k, flagship 120-150k USD.', 10.5, CREAM)
p.text(48, 178, 'Waste target <3% (dashboard-tracked); SLA <12 min (KDS timers); cancellations target <2%.', 10, MUT, 'I')
P.append(p)

p = Page(); base(p); title(p, '07 - GROWTH', 'HURGHADA NOW.', 'CAIRO NEXT. GCC AFTER.')
steps = [('NOW', 'flagship live'), ('2027', 'Cairo x2 + cloud kitchen'), ('2028', '10 stores'), ('2029+', '50 + GCC master')]
x = 48
for t, d in steps:
    p.rect(x, 240, 168, 80, CARD); p.text(x + 14, 292, t, 18, GOLD, 'B'); p.text(x + 14, 266, d, 10, CREAM)
    if x < 600: p.text(x + 174, 274, '>', 18, GOLD, 'B')
    x += 186
bullets(p, 48, 200, ['Franchise-light: company stores first, franchising after central kitchen #2.', 'Resort seasonality hedged by Cairo office-lunch demand and delivery mix.'], 10.5, 20)
P.append(p)

p = Page(); base(p); title(p, '08 - MOAT', 'DATA, SUPPLY, SYSTEM.', 'NOT A RECIPE.')
bullets(p, 48, H - 260, [
    'Owned scan-CRM: SKU-level quality + repeat data no platform can sell us back.',
    'Central kitchen + gram-level specs: taste identical in store #1 and store #50.',
    'Brand system + content engine: packaging that asks "where did you get that?" for us.',
    'Franchise playbook with risk dashboard culture: partners buy discipline, not vibes.',
]); P.append(p)

p = Page(); base(p); title(p, '09 - TEAM', 'FOUNDER-LED.', 'OPS-HIRED.')
bullets(p, 48, H - 260, [
    'Alla Miller - founder: brand, product, host of the concept; face of the Nile on all channels.',
    'Hiring with flagship: store manager (P&L owner), ops lead (SOPs/supply), content lead (UGC engine).',
    'Advisors in conversation: QSR supply chain, EG payments (Paymob ecosystem), resort-zone real estate.',
]); P.append(p)

p = Page(); base(p); title(p, '10 - ROADMAP & ASK', 'SIX WEEKS TO LIVE.', 'EIGHTEEN MONTHS TO TEN STORES.')
steps = [('W1-2', 'prod build, CMS, payments sandbox'), ('W3-4', 'WA API, QR print, consent/legal'), ('W5-6', 'load/a11y/SEO, soft launch'), ('M3+', 'cohort data -> Series A story')]
y = H - 250
for t, d in steps:
    p.rect(48, y - 12, 64, 22, GOLD); p.text(56, y - 5, t, 11, BLACK, 'B'); p.text(126, y - 4, d, 11.5, CREAM); y -= 32
p.rect(48, 96, W - 96, 52, CARD)
p.text(66, 126, 'ASK: USD 250k pre-seed - central kitchen #2, 2 Cairo counters, 18-month runway to 10-store metrics.', 10.5, CREAM, 'B')
p.text(66, 108, 'Milestones gated: each tranche releases on cohort/repeat/waste targets, not on calendar.', 9.5, MUT, 'I')
P.append(p)

p = Page(); p.rect(0, 0, W, H, BLACK); p.rect(0, 0, W, 14, GOLD)
p.text(48, H - 180, 'TASTE THE NILE.', 54, GOLD, 'B')
p.text(48, H - 220, 'hello@nilebites.com - franchise@nilebites.com - +20 65 000 0000', 13, CREAM)
p.text(48, H - 250, 'Data room & deck: nilebites.com/franchise (gate). One-pager: investor room on site.', 10.5, MUT)
p.text(48, 60, 'CONFIDENTIAL - not an offer of securities.', 8, MUT, 'I')
P.append(p)

assemble(P, os.path.join(KIT, 'NileBites-Pitch-Deck.pdf'))
