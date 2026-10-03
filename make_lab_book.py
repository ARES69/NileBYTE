#!/usr/bin/env python3
"""
Nile Bites — NILE LAB showcase book (investor longread, pure-python PDF with JPEG pages).
22 pages: cover + ethics + 19 demo pages (screenshot + pitch + prod deps) + closing.
"""
import io, os
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
LAB = os.path.join(ROOT, 'shots', 'lab')
OUT = os.path.join(ROOT, 'franchise-kit', 'NileBites-LAB-Showcase.pdf')
W, H = 842, 595
BLACK = (0.043, 0.035, 0.024); GOLD = (0.878, 0.655, 0.173); GOLDL = (0.949, 0.808, 0.447)
CREAM = (0.961, 0.937, 0.878); TERRA = (0.886, 0.439, 0.227); MUT = (0.62, 0.58, 0.52)
GREEN = (0.435, 0.827, 0.659); CARD = (0.09, 0.07, 0.05)


def esc(t):
    t = t.replace('\u2014', '-').replace('\u2013', '-').replace('\u2019', "'").replace('\u2018', "'")
    t = t.replace('\u2022', '-').replace('`', "'")
    return t.replace('\\', r'\\').replace('(', r'\(').replace(')', r'\)')


def wrap(t, n=58):
    out, line = [], ''
    for w in t.split():
        if len(line) + len(w) + 1 > n:
            out.append(line); line = w
        else:
            line = (line + ' ' + w).strip()
    if line: out.append(line)
    return out


class Page:
    def __init__(self): self.c = []; self.imgs = []
    def rect(self, x, y, w, h, col): self.c.append('%f %f %f rg %f %f %f %f re f' % (col[0], col[1], col[2], x, y, w, h))
    def text(self, x, y, t, size=11, col=CREAM, font='R'):
        f = {'B': 'F1', 'I': 'F2', 'R': 'F3'}[font]
        self.c.append('BT /%s %f Tf %f %f %f rg %f %f Td (%s) Tj ET' % (f, size, col[0], col[1], col[2], x, y, esc(t)))
    def image(self, path, x, y, w, crop=None):
        im = Image.open(path).convert('RGB')
        if crop:
            iw, ih = im.size
            im = im.crop((0, int(ih * crop[0]), iw, int(ih * crop[1])))
        if im.width > 1000:
            im = im.resize((1000, int(im.height * 1000 / im.width)), Image.LANCZOS)
        buf = io.BytesIO(); im.save(buf, 'JPEG', quality=74, optimize=True)
        idx = len(self.imgs) + 1
        self.imgs.append((buf.getvalue(), im.width, im.height))
        h = w * im.height / im.width
        self.c.append('q %f 0 0 %f %f %f cm /Im%d Do Q' % (w, h, x, y, idx))
        return h
    def stream(self): return '\n'.join(self.c).encode('latin-1', 'replace')


DEMOS = [
    ('H1', 'Nile Genius', '01-genius.png', None, 'AI cup advisor: mood, spice and diet in three taps - the advisor assembles the cup and applies it to the builder. Production: LLM with brand tokens + RAG over menu, allergens and member history.', 'menu CMS, allergen matrix, Club history'),
    ('H1', 'Smart Save', '02-save.png', None, 'Waste-zero dynamic offers: tonight forecast puts specific cups on -30/-40% instead of into the bin. Discounts only down - brand rule.', 'waste journal + hourly sales from Outbox'),
    ('H1', 'AR Cup Story', '03b-ar-overlay.png', None, 'Point the phone at any cup: the Nile line draws itself, the crocodile swims, the bite tells its story in EN/AR/RU. WebAR - no app install.', '3D asset + print marker on the sleeve'),
    ('H1', 'NFC Tap Cup', '04-nfc.png', None, 'Tap the lid: instant points, authenticity check, one-tap reorder. Opt-in, cup-id only, zero PII on the tag.', 'NFC tag batch (EUR 0.03/unit), Club API'),
    ('H1', 'Churn / LTV scoring', '13-churn.png', None, 'Per-member risk score and 12-month LTV with a recommended action and offer size - winbacks stop being guesswork.', '90 days of orders + scans'),
    ('H1', 'Waste forecast + auto-PO', '14-waste.png', None, 'Tomorrow waste by SKU with thresholds; the system drafts purchase orders, a human approves. 8,420 EGP prevented in the demo month.', 'supply calendar, waste journal, events'),
    ('H1', 'CV QC at pass window', '15-cv.png', None, 'Camera checks fill %, garnish and steam before the cup leaves the counter. The model looks at cups, never at people - ethics rule #2.', 'edge box + camera at pass window'),
    ('H1', 'Digital twin of the queue', '16-twin.png', (0.0, 0.55), 'Discrete-event simulation of the next 3 hours: +1 crew at 19:00-21:00 cuts projected wait 14 to 7 min. Recommendation, not order - manager decides, audit-log keeps it.', 'KDS timers history'),
    ('H2', 'Voice order AR/EN/RU', '05-voice.png', None, 'Say it like on the street: "twelve kofta, shatta, crispy onion" - on-device speech (ar-EG/en-US/ru-RU) parses intent into the cup. Fallback demo phrases when mic is absent.', 'WA Cloud API + dialect ASR for phone channel'),
    ('H2', 'Nile Pass subscription', '06-pass.png', None, 'One cup a day for 1,999 EGP / 30 days, pause anytime, points stack on top. Pass card with QR lives in the Club; MRR lands in admin Loyalty KPI.', 'Paymob recurring billing'),
    ('H2', 'Robot delivery pilot', '07b-robot-checkout.png', None, 'Third checkout mode: ROBOT PILOT on the Marina promenade, 20:00-24:00, 25 min, free. Live rover tracker with battery and dock status in the LAB.', 'municipal pilot, insurance, rover fleet'),
    ('H2', 'Smart Cup IoT', '08-iot.png', None, 'BLE sensor in the lid: live temperature, perfect-window countdown, freshness timer on the phone. Cup-id only - privacy by design.', 'PCB batch, BLE pairing flow'),
    ('H2', 'Generative city creatives', '17-creatives.png', None, 'City x hook produces three on-brand copy variants with palette swatches; brand-guard checklist (clearspace, no surge, AR register, allergen link) and mandatory human approve.', 'LLM pipeline + brand-guard review queue'),
    ('H2', 'Predictive staffing', '16-twin.png', (0.45, 1.0), 'Next-week roster from the demand forecast: crew now vs crew AI with deltas per day. Approve button signs a human decision - forecasts never fire people (ethics rule #5).', 'HR integration, event calendars'),
    ('H2', 'Waste ledger (measured)', '09-ledger.png', None, 'Public audited ledger: 412 kg waste YTD (-38% vs plan), 9,180 cups diverted, 87% packaging recycled, 0 unverified claims. The anti-greenwashing rule made visible.', 'waste journal as source of truth'),
    ('H3', 'Taste Profile ID', '10-taste.png', None, 'Three taps - heat, cream, freshness - and the central kitchen knows your personal sauce blend. The ID travels with your Club; BREW MY CUP tunes the builder to it.', 'blend production at central kitchen'),
    ('H3', 'Cup as ticket', '11-ticket.png', None, 'The empty cup becomes a city ticket: felucca sunset -20%, museum cafe tea, night market spices. Partner network of tourism loves a measurable footfall source.', 'partner API / promo codes'),
    ('H3', 'Franchise AI co-pilot', '12-copilot.png', None, 'Sliders for foot traffic, rent and competitors plus format choice produce a conservative unit P&L: orders, revenue, EBITDA, margin, payback and a 0-97 site score with a verdict. Sends the sim straight to the franchise team.', 'traffic datasets, rent benchmarks'),
    ('H3', 'Autonomous kiosk fleet', '19-kiosk.png', None, 'Kiosk without a shift: robot-arm finish, CV QC, self-clean at 02:00. AUTO/MANUAL toggle with audit trail; incidents page the manager in 15 min.', 'robot arm integration, safety cert'),
]

P = []
# ---- cover
p = Page(); p.rect(0, 0, W, H, BLACK); p.rect(0, H - 14, W, 14, GOLD)
p.text(48, H - 120, 'NILE LAB', 72, CREAM, 'B')
p.text(50, H - 152, 'FEATURES FROM THE FUTURE - SHOWCASE BOOK', 15, GOLD, 'B')
p.text(48, H - 210, '19 living demos across three horizons:', 13, CREAM)
p.text(48, H - 232, 'H1 2026-27 (8) - H2 2027-28 (7) - H3 2028+ (4).', 13, CREAM)
p.text(48, H - 270, 'Every demo is clickable in the concept today; every demo lists', 11, MUT)
p.text(48, H - 288, 'what it needs to become production. Ethics rules inside.', 11, MUT)
p.rect(48, 90, 240, 3, GOLD)
p.text(48, 66, 'NILE BITES - EGYPTIAN STREET FOOD. MADE TO GO.', 11, TERRA, 'B')
p.text(48, 44, 'CONFIDENTIAL - investor material - 2026', 8, MUT, 'I')
p.image(os.path.join(LAB, '03b-ar-overlay.png'), 470, 60, 330)
P.append(p)

# ---- ethics page
p = Page(); p.rect(0, 0, W, H, BLACK); p.rect(48, H - 96, 60, 3, GOLD)
p.text(48, H - 84, 'N I L E   B I T E S', 9, GOLD, 'B')
p.text(48, H - 150, 'LAB ETHICS - SIX RULES', 30, CREAM, 'B')
rules = [
    '1. Discounts only down. Dynamic pricing never surges on hunger - only rescues waste.',
    '2. Cameras look at cups, not people. Face detection off at model level; frames never leave the edge.',
    '3. NFC and scans are opt-in. Tags carry cup-id only - no PII, no tracking without consent.',
    '4. Bots disclose themselves. Voice and chat agents always say they are Nile Bot.',
    '5. Forecasts never fire people. Staffing and roster decisions stay human, audit-logged.',
    '6. Measured claims only. Public sustainability numbers come from the audited waste ledger.'
]
y = H - 200
for r in rules:
    p.rect(48, y - 10, 5, 5, GOLD)
    p.text(62, y - 8, r, 12.5, CREAM)
    y -= 34
p.text(48, 60, 'A future feature ships only when its data, hardware and legal basis exist - otherwise it stays a demo here.', 10, MUT, 'I')
P.append(p)

# ---- demo pages
for i, (hz, title, img, crop, pitch, deps) in enumerate(DEMOS, 1):
    p = Page(); p.rect(0, 0, W, H, BLACK)
    p.rect(0, H - 10, W, 10, GOLD)
    p.text(48, H - 60, '%s - DEMO %02d/19' % (hz, i), 10, TERRA, 'B')
    p.text(48, H - 96, title.upper(), 26, CREAM, 'B')
    yy = H - 130
    for ln in wrap(pitch, 52):
        p.text(48, yy, ln, 10.5, CREAM); yy -= 15
    yy -= 8
    p.text(48, yy, 'TO PRODUCTION:', 9, GOLD, 'B'); yy -= 14
    for ln in wrap(deps, 52):
        p.text(48, yy, ln, 9.5, MUT); yy -= 13
    p.text(48, 40, 'status: demo live in concept (site #lab / admin AI) - data-layer writes enabled', 8.5, GREEN, 'I')
    p.image(os.path.join(LAB, img), 380, 70, 420, crop=crop)
    P.append(p)

# ---- closing
p = Page(); p.rect(0, 0, W, H, BLACK); p.rect(0, 0, W, 14, GOLD)
p.text(48, H - 110, 'THE LAB IS A PROMISE,', 34, CREAM, 'B')
p.text(48, H - 146, 'NOT A TEASER.', 34, GOLD, 'B')
p.text(48, H - 190, 'H1 demos ride on data the flagship will produce in its first 90 days.', 12, CREAM)
p.text(48, H - 210, 'H2 needs one hardware or billing dependency each - listed per page.', 12, CREAM)
p.text(48, H - 230, 'H3 stays R&D until the network makes it cheap. Nothing ships dark.', 12, CREAM)
p.rect(48, H - 270, 300, 2, GOLD)
p.text(48, H - 300, 'NILE BITES - TASTE THE NILE.', 16, TERRA, 'B')
p.text(48, H - 322, 'hello@nilebites.com - franchise@nilebites.com - nilebites.com', 11, CREAM)
p.text(48, 44, 'Screens: concept build 30.09.2026 - all interactions verifiable live in index.html / admin.html', 8.5, MUT, 'I')
P.append(p)

# ---------------- assemble PDF with image XObjects
objs = [b'<</Type/Catalog/Pages 2 0 R>>',
        ('<</Type/Pages/Kids[%s]/Count %d>>' % (' '.join('%d 0 R' % (3 + i * 3) for i in range(len(P))), len(P))).encode()]
nf = 3 + 3 * len(P) + 1
for i, pg in enumerate(P):
    st = pg.stream()
    xobjs = ' '.join('/Im%d %d 0 R' % (j + 1, nf + i * 3 + j) for j in range(len(pg.imgs))) if pg.imgs else ''
    res = '<</Font<</F1 %d 0 R /F2 %d 0 R /F3 %d 0 R>>%s>>' % (nf + 3 * len(P), nf + 3 * len(P) + 1, nf + 3 * len(P) + 2, (' /XObject<<' + xobjs + '>>') if xobjs else '')
    objs.append(('<</Type/Page/Parent 2 0 R/MediaBox[0 0 %d %d]/Resources %s/Contents %d 0 R>>' % (W, H, res, 4 + i * 3)).encode())
    objs.append(b'<</Length %d>>\nstream\n%b\nendstream' % (len(st), st))
    for data, iw, ih in pg.imgs:
        objs.append(b'<</Type/XObject/Subtype/Image/Width %d/Height %d/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length %d>>\nstream\n%b\nendstream' % (iw, ih, len(data), data))
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
open(OUT, 'wb').write(out)
print('LAB book:', OUT, '%.0f KB' % (len(out) / 1024), 'pages:', len(P))
