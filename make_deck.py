#!/usr/bin/env python3
"""
Nile Bites — Franchise Deck generator (pure-python, no deps)
Outputs: franchise-kit/NileBites-Franchise-Deck.pdf  (10 slides, brand palette)
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'franchise-kit', 'NileBites-Franchise-Deck.pdf')

W, H = 842, 595  # A4 landscape
BLACK = (0.043, 0.035, 0.024)
GOLD = (0.878, 0.655, 0.173)
GOLDL = (0.949, 0.808, 0.447)
CREAM = (0.961, 0.937, 0.878)
TERRA = (0.886, 0.439, 0.227)
MUT = (0.62, 0.58, 0.52)
GREEN = (0.435, 0.827, 0.659)


def esc(t):
    t = t.replace('\u2014', '-').replace('\u2013', '-').replace('\u2018', "'").replace('\u2019', "'")
    t = t.replace('`', "'")
    return t.replace('\\', r'\\').replace('(', r'\(').replace(')', r'\)')


class Page:
    def __init__(self):
        self.c = []

    def rect(self, x, y, w, h, col, op=1):
        self.c.append('%f %f %f rg %f %f %f %f re f' % (col[0], col[1], col[2], x, y, w, h))

    def text(self, x, y, t, size=11, col=CREAM, font='Helvetica', ls=0):
        if ls:
            t = (' ' * 0).join(t)  # simple: spaced string handled by caller
        self.c.append('BT /%s %f Tf %f %f %f rg %d Tc %f %f Td (%s) Tj ET'
                      % ('F1' if font == 'B' else ('F2' if font == 'I' else 'F3'),
                         size, col[0], col[1], col[2], ls, x, y, esc(t)))

    def line(self, x, y, w, h, col):
        self.rect(x, y, w, h, col)

    def stream(self):
        return '\n'.join(self.c).encode('latin-1', 'replace')


def base(p):
    """standard slide chrome"""
    p.rect(0, 0, W, H, BLACK)
    p.line(48, H - 96, 60, 3, GOLD)
    p.text(48, H - 84, 'N I L E   B I T E S', 9, GOLD, 'B', 0)
    p.text(W - 48, H - 84, 'FRANCHISE DECK · 2026 · CONFIDENTIAL', 8, MUT, 'I')
    p.line(48, 40, W - 96, 0.8, (0.2, 0.17, 0.13))
    p.text(48, 26, 'nilebites.com · hello@nilebites.com · +20 65 000 0000', 8, MUT)
    p.text(W - 48, 26, 'EGYPTIAN STREET FOOD. MADE TO GO.', 8, MUT, 'I')


def title(p, kicker, t1, t2=None):
    p.text(48, H - 140, kicker, 10, TERRA, 'B')
    p.text(48, H - 178, t1, 34, CREAM, 'B')
    if t2:
        p.text(48, H - 212, t2, 34, GOLD, 'B')


def bullets(p, x, y, items, size=11, lead=19, col=CREAM):
    for i, it in enumerate(items):
        p.rect(x, y - i * lead - size + 3, 5, 5, GOLD)
        p.text(x + 14, y - i * lead, it, size, col)


P = []

# 1 cover
p = Page()
p.rect(0, 0, W, H, BLACK)
p.rect(0, H - 14, W, 14, GOLD)
p.text(48, H - 150, 'NILE', 96, CREAM, 'B')
p.text(48, H - 236, 'BITES', 96, GOLD, 'B')
p.text(50, H - 276, 'EGYPTIAN STREET FOOD. MADE TO GO.', 13, TERRA, 'B')
p.line(48, H - 310, 220, 2, GOLD)
p.text(48, H - 340, 'FRANCHISE DECK 2026', 18, CREAM, 'B')
p.text(48, H - 362, 'One cup. Many flavours. A brand built to scale.', 11, MUT)
p.text(48, 60, 'CONFIDENTIAL — for qualified partners only. Not an offer of securities.', 8, MUT, 'I')
p.text(W - 250, 60, 'Dumplings · Sauces · Street Food', 9, GOLD, 'I')
P.append(p)

# 2 concept
p = Page(); base(p)
title(p, '01 · THE CONCEPT', 'STREET FOOD CULTURE,', 'PACKAGED LIKE A BRAND.')
bullets(p, 48, H - 260, [
    'Nile Bites takes Egypt`s dumpling comfort food and serves it in one cup, made to go.',
    'Modern identity built on Cairo street culture: bold type, gold-on-black, the Nile line.',
    'Five fillings, four signature sauces, one format — fast to learn, fast to scale.',
    'Designed for high-traffic zones: promenades, beaches, malls, food courts, nightlife.',
])
p.rect(W - 320, 90, 272, 330, (0.09, 0.07, 0.05))
p.text(W - 300, 380, 'THE FORMAT', 10, GOLD, 'B')
p.text(W - 300, 350, 'HOT BITES IN A CUP', 20, CREAM, 'B')
p.text(W - 300, 322, '8 / 12 / 18 bites', 12, CREAM)
p.text(W - 300, 302, '4 sauces · 5 toppings', 12, CREAM)
p.text(W - 300, 282, 'Ready in 4 minutes', 12, GREEN)
p.line(W - 300, 260, 232, 1, (0.3, 0.26, 0.2))
p.text(W - 300, 236, 'AVG CHECK', 9, MUT)
p.text(W - 300, 210, '114 EGP', 30, GOLD, 'B')
p.text(W - 300, 180, 'target, mix of sizes & toppings', 9, MUT, 'I')
P.append(p)

# 3 product
p = Page(); base(p)
title(p, '02 · THE PRODUCT', 'FIVE FILLINGS.', 'FOUR SAUCES. ONE CUP.')
rows = [('KOFTA', 'Beef · onion · Egyptian spices', '145'), ('SHAWARMA', 'Chicken · garlic · spices', '140'),
        ('SHATTA', 'Spicy beef · chilli · herbs', '150'), ('CHEESE', 'Cheese · herbs · garlic (veg)', '125'),
        ('NILE SHRIMP', 'Shrimp · garlic · lemon', '175')]
y = H - 260
for n, d, pr in rows:
    p.rect(48, y - 14, 300, 26, (0.09, 0.07, 0.05))
    p.text(58, y - 6, n, 13, CREAM, 'B')
    p.text(180, y - 6, d, 10, MUT)
    p.text(360, y - 6, pr + ' EGP', 12, GOLD, 'B')
    y -= 36
p.text(48, y - 10, 'Sauces: Nile Garlic · Shatta · Tahini · Nile Signature (secret recipe)', 11, CREAM)
p.text(48, y - 30, 'Allergen matrix & kcal per cup published on-site and on pack QR.', 10, MUT, 'I')
p.rect(W - 300, 120, 252, 260, (0.09, 0.07, 0.05))
p.text(W - 280, 350, 'CUP ECONOMICS', 10, GOLD, 'B')
p.text(W - 280, 320, 'food cost 31%', 12, CREAM)
p.text(W - 280, 298, 'packaging 6%', 12, CREAM)
p.text(W - 280, 276, 'gross margin 63%', 12, GREEN)
p.line(W - 280, 256, 212, 1, (0.3, 0.26, 0.2))
p.text(W - 280, 232, 'HALAL', 9, MUT)
p.text(W - 280, 210, '100% CERTIFIED', 16, CREAM, 'B')
P.append(p)

# 4 brand & packaging
p = Page(); base(p)
title(p, '03 · BRAND & PACKAGING', 'DESIGNED TO BE SEEN.', 'BUILT TO BE SHARED.')
bullets(p, 48, H - 260, [
    'Identity: gold-on-black, hand-drawn Nile line, Eye-of-Horus mark, Arabic display type.',
    'Packaging system: cup, sleeve, sauce pot, bag, box, napkins, delivery seal.',
    'Every cup carries a QR: rate your bite, join Nile Club, refer a buddy — owned CRM.',
    'Content engine: UGC-first (TikTok/Reels), #MyNileBite wall in store and on site.',
])
p.rect(W - 320, 110, 272, 300, (0.09, 0.07, 0.05))
p.text(W - 300, 380, 'PACK SYSTEM', 10, GOLD, 'B')
for i, w in enumerate(['CUP', 'SAUCE', 'BAG', 'BOX', 'NAPKINS', 'DELIVERY']):
    p.text(W - 300, 350 - i * 24, '—  ' + w, 12, CREAM)
P.append(p)

# 5 unit economics
p = Page(); base(p)
title(p, '04 · UNIT ECONOMICS', 'ONE STORE.', 'HONEST NUMBERS.')
kpi = [('ORDERS / DAY', '300', 'blended weekday+weekend'), ('AVG CHECK', '114 EGP', 'mix of sizes & toppings'),
       ('REVENUE / MONTH', '1.03M EGP', '300 x 114 x 30'), ('EBITDA MARGIN', '18-22%', 'after rent & payroll')]
x = 48
for t, v, n in kpi:
    p.rect(x, 250, 172, 120, (0.09, 0.07, 0.05))
    p.text(x + 14, 340, t, 9, MUT)
    p.text(x + 14, 306, v, 24, GOLD, 'B')
    p.text(x + 14, 282, n, 8.5, MUT, 'I')
    x += 186
p.text(48, 210, 'Monthly P&L skeleton (EGP):', 11, CREAM, 'B')
pn = [('Revenue', 1030000, GOLD), ('Food & packaging', -381000, TERRA), ('Payroll (14 FTE)', -248000, TERRA),
      ('Rent & utilities', -120000, TERRA), ('Marketing', -62000, TERRA), ('EBITDA', 221000, GREEN)]
y = 186
for n, v, c in pn:
    p.text(48, y, n, 10.5, CREAM)
    p.text(300, y, ('%s' % format(abs(v), ',')), 10.5, c, 'B')
    p.rect(380, y - 3, max(4, abs(v) / 1030000 * 380), 8, c)
    y -= 22
p.text(48, y - 8, 'Payback: 3-8 months at target traffic (see investment slide).', 10, MUT, 'I')
P.append(p)

# 6 investment
p = Page(); base(p)
title(p, '05 · INVESTMENT', 'WHAT IT COSTS.', 'WHAT IT RETURNS.')
inv = [('KIOSK / COUNTER', '50-80k USD', 'malls, food courts, promenades'),
       ('STREET STORE', '80-120k USD', '40-70 sq.m, nightlife zones'),
       ('FLAGSHIP + CLOUD', '120-150k USD', 'store + delivery hub')]
y = H - 250
for n, v, d in inv:
    p.rect(48, y - 18, 420, 44, (0.09, 0.07, 0.05))
    p.text(62, y, n, 13, CREAM, 'B')
    p.text(62, y - 16, d, 9, MUT, 'I')
    p.text(360, y, v, 15, GOLD, 'B')
    y -= 58
bullets(p, 500, H - 250, [
    'Franchise fee: disclosed at discovery (NDA).',
    'Royalty: 5% of net revenue.',
    'Marketing fund: 2% of net revenue.',
    'Payback target: 3-8 months.',
    'Territory protection: 1.5 km radius.',
], 10.5, 20)
P.append(p)

# 7 supply & ops
p = Page(); base(p)
title(p, '06 · SUPPLY & OPERATIONS', 'CENTRAL KITCHEN.', 'COLD CHAIN. SOPs.')
bullets(p, 48, H - 260, [
    'Central kitchen produces filled, blast-frozen bites; stores finish in 4 minutes.',
    'Approved halal suppliers; gram-level recipe specs; no chef required in store.',
    'SOP pack: opening checklist, food-safety protocols, KDS flow, mystery-shopper QA.',
    'POS + KDS + QR CRM from day one; daily dashboards (sales, waste, peak hours).',
    'Training: 2 weeks crew certification at the Hurghada flagship.',
])
p.rect(W - 300, 130, 252, 250, (0.09, 0.07, 0.05))
p.text(W - 280, 350, 'STORE TEAM', 10, GOLD, 'B')
p.text(W - 280, 322, '1 store manager', 11.5, CREAM)
p.text(W - 280, 302, '2 shift leads', 11.5, CREAM)
p.text(W - 280, 282, '8-11 crew (part-time ok)', 11.5, CREAM)
p.text(W - 280, 254, 'PEAK 19:00-21:00', 10, TERRA, 'B')
p.text(W - 280, 232, '31% of daily orders', 10.5, MUT)
P.append(p)

# 8 expansion
p = Page(); base(p)
title(p, '07 · EXPANSION', 'ONE COUNTER TODAY.', 'A NETWORK TOMORROW.')
steps = [('NOW', 'Hurghada flagship', GOLD), ('2027', 'Cairo · Sharm · Alex', TERRA),
         ('2028', '10 stores + central kitchen', TERRA), ('2029+', '50 stores · GCC entry', CREAM)]
x = 48
for t, d, c in steps:
    p.rect(x, 240, 168, 90, (0.09, 0.07, 0.05))
    p.text(x + 14, 300, t, 18, c, 'B')
    p.text(x + 14, 272, d, 10, CREAM)
    if x < 600:
        p.text(x + 174, 278, '>', 18, GOLD, 'B')
    x += 186
bullets(p, 48, 200, [
    'Pipeline: Marsa Alam, Luxor (tourism), New Capital (office lunch).',
    'GCC master-franchise conversations: UAE, KSA (Egyptian diaspora + tourists).',
    'Format mix keeps capex low: 60% counters, 30% street stores, 10% flagships.',
], 10.5, 20)
P.append(p)

# 9 support
p = Page(); base(p)
title(p, '08 · WHAT YOU GET', 'SIX BLOCKS.', 'ZERO GUESSWORK.')
cards = [('BRAND', 'identity, packaging, store design, tone of voice'),
         ('RECIPES', 'gram-level specs, halal sourcing options'),
         ('TRAINING', '2-week certification, QA playbook'),
         ('SUPPLY', 'central kitchen, approved suppliers, cold chain'),
         ('OPERATIONS', 'SOPs, POS/KDS setup, food-safety protocols'),
         ('MARKETING', 'launch kit, content templates, TikTok/IG playbook')]
x, y = 48, H - 250
for i, (t, d) in enumerate(cards):
    cx = x + (i % 3) * 252
    cy = y - (i // 3) * 110
    p.rect(cx, cy - 40, 236, 92, (0.09, 0.07, 0.05))
    p.text(cx + 14, cy + 22, '0%d  %s' % (i + 1, t), 13, GOLD, 'B')
    p.text(cx + 14, cy - 2, d, 9.5, CREAM)
    p.text(cx + 14, cy - 18, '', 9, MUT)
P.append(p)

# 10 process
p = Page(); base(p)
title(p, '09 · PROCESS', 'FROM LEAD TO OPENING:', '6-10 WEEKS.')
steps = [('1', 'Lead + qualification call', '< 24 h response'), ('2', 'Deck + data room (NDA)', 'day 2-4'),
         ('3', 'Discovery day at flagship', 'week 2-3'), ('4', 'FDD + agreements', '14-day rule respected'),
         ('5', 'Fit-out + training', 'week 4-8'), ('6', 'Opening + launch campaign', 'week 6-10')]
y = H - 250
for n, t, d in steps:
    p.rect(48, y - 12, 22, 22, GOLD)
    p.text(55, y - 5, n, 11, BLACK, 'B')
    p.text(84, y - 4, t, 12, CREAM, 'B')
    p.text(420, y - 4, d, 10, MUT, 'I')
    y -= 34
p.rect(48, 70, W - 96, 60, (0.09, 0.07, 0.05))
p.text(66, 100, 'NEXT STEP: book a discovery call — franchise@nilebites.com', 14, GOLD, 'B')
p.text(66, 80, 'Or scan the QR on any Nile Bites cup and taste the product first. We wait.', 10, MUT, 'I')
P.append(p)

# ---------------------------------------------------------------- assemble
objs = []
objs.append(b'<</Type/Catalog/Pages 2 0 R>>')
kids = ' '.join('%d 0 R' % (3 + i * 2) for i in range(len(P)))
objs.append(('<</Type/Pages/Kids[%s]/Count %d>>' % (kids, len(P))).encode())
for i, pg in enumerate(P):
    st = pg.stream()
    objs.append(('<</Type/Page/Parent 2 0 R/MediaBox[0 0 %d %d]/Resources<</Font<</F1 0 R /F2 0 R /F3 0 R>>>>/Contents %d 0 R>>' % (W, H, 0)).encode())
# fonts as separate objects: rebuild properly below
objs = []
font_ids = {}
n_obj = 3 + 2 * len(P) + 1  # fonts at the end
objs.append(b'<</Type/Catalog/Pages 2 0 R>>')
objs.append(('<</Type/Pages/Kids[%s]/Count %d>>' % (' '.join('%d 0 R' % (3 + i * 2) for i in range(len(P))), len(P))).encode())
for i, pg in enumerate(P):
    st = pg.stream()
    objs.append(('<</Type/Page/Parent 2 0 R/MediaBox[0 0 %d %d]/Resources<</Font<</F1 %d 0 R /F2 %d 0 R /F3 %d 0 R>>>>/Contents %d 0 R>>'
                 % (W, H, n_obj, n_obj + 1, n_obj + 2, 4 + i * 2)).encode())
    objs.append(b'<</Length %d>>\nstream\n%b\nendstream' % (len(st), st))
objs.append(b'<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold>>')      # F1
objs.append(b'<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Oblique>>')   # F2
objs.append(b'<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>')           # F3

out = b'%PDF-1.4\n'
offsets = []
for i, o in enumerate(objs, 1):
    offsets.append(len(out))
    out += b'%d 0 obj\n%b\nendobj\n' % (i, o)
xref = len(out)
out += b'xref\n0 %d\n0000000000 65535 f \n' % (len(objs) + 1)
for off in offsets:
    out += b'%010d 00000 n \n' % off
out += b'trailer\n<</Size %d/Root 1 0 R>>\nstartxref\n%d\n%%%%EOF' % (len(objs) + 1, xref)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'wb').write(out)
print('deck written:', OUT, '%.0f KB' % (len(out) / 1024), 'pages:', len(P))
