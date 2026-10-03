#!/usr/bin/env python3
"""
Nile Bites — build script
Embeds fonts (base64) + optimised photos into a single self-contained index.html
so the file works offline (preview iframe has no network access).
"""
import base64, io, os, re, sys
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(ROOT, 'src')
OUT  = os.path.join(ROOT, 'index.html')
IMG  = os.path.join(ROOT, 'img')
FNT  = os.path.join(ROOT, 'fonts')

MIME = {'.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
        '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2'}

# name -> (max width, quality)
IMG_SPEC = {
    'hero-cup':   (1500, 78),
    'bite-kofta': (900, 76),
    'bite-shawarma': (900, 76),
    'bite-shatta': (900, 76),
    'bite-cheese': (900, 76),
    'bite-shrimp': (900, 76),
    'packaging':  (1100, 78),
    'nile-sunset':(1600, 74),
    'tourist':    (900, 76),
    'social-1':   (560, 72),
    'social-2':   (560, 72),
    'social-3':   (560, 72),
    'founder-cup': (900, 80),
    'product-street': (700, 82),
    'packaging-board': (1254, 84),
}


CACHE = {}
FALLBACK = ('data:image/svg+xml;charset=utf-8,' +
            "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E"
            "%3Crect width='4' height='3' fill='%23241d17'/%3E%3C/svg%3E")


def load_image(name):
    for ext in ('.jpg', '.jpeg', '.png'):
        p = os.path.join(IMG, name + ext)
        if os.path.exists(p):
            return p
    return None


def optimise(path, maxw, q):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    if w > maxw:
        im = im.resize((maxw, int(h * maxw / w)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
    return buf.getvalue()


def data_uri(raw, mime):
    return 'data:%s;base64,%s' % (mime, base64.b64encode(raw).decode())


def main():
    html = open(os.path.join(SRC, 'index.html'), encoding='utf-8').read()
    css  = open(os.path.join(SRC, 'styles.css'), encoding='utf-8').read()
    js   = open(os.path.join(SRC, 'app.js'), encoding='utf-8').read()

    deck = os.path.join(ROOT, 'franchise-kit', 'NileBites-Franchise-Deck.pdf')
    if os.path.exists(deck):
        import base64 as _b64
        js = js.replace('@@DECK_B64@@', _b64.b64encode(open(deck, 'rb').read()).decode())
        inv = os.path.join(ROOT, 'franchise-kit', 'NileBites-Investor-OnePager.pdf')
        if os.path.exists(inv):
            js = js.replace('@@INV_B64@@', _b64.b64encode(open(inv, 'rb').read()).decode())

    stats = []

    # fonts -> data uri inside css
    def font_sub(m):
        fn = m.group(1)
        p = os.path.join(FNT, fn)
        if not os.path.exists(p):
            print('  ! missing font', fn); return m.group(0)
        raw = open(p, 'rb').read()
        stats.append(('font', fn, len(raw)))
        return data_uri(raw, MIME.get(os.path.splitext(fn)[1], 'font/ttf'))

    css = re.sub(r"@@FONT:([^@]+?)@@", font_sub, css)

    # images -> data uri inside css + html
    def img_sub(m):
        name = m.group(1).strip()
        if name in CACHE:
            return CACHE[name]
        p = load_image(name)
        if not p:
            print('  ! missing image', name, '-> placeholder')
            CACHE[name] = FALLBACK
            return FALLBACK
        maxw, q = IMG_SPEC.get(name, (1000, 76))
        raw = optimise(p, maxw, q)
        stats.append(('img', name + '.jpg', len(raw)))
        uri = data_uri(raw, 'image/jpeg')
        CACHE[name] = uri
        return uri

    html = re.sub(r"@@IMG:([^@]+?)@@", img_sub, html)
    css  = re.sub(r"@@IMG:([^@]+?)@@", img_sub, css)

    html = html.replace('<link rel="stylesheet" href="styles.css">',
                        '<style>\n' + css + '\n</style>')
    html = html.replace('<script src="app.js"></script>',
                        '<script>\n' + js + '\n</script>')

    # ---------- admin ----------
    a_html = os.path.join(SRC, 'admin.html')
    if os.path.exists(a_html):
        ah = open(a_html, encoding='utf-8').read()
        ac = open(os.path.join(SRC, 'admin.css'), encoding='utf-8').read()
        aj = open(os.path.join(SRC, 'admin.js'), encoding='utf-8').read()
        ac = re.sub(r"@@FONT:([^@]+?)@@", font_sub, ac)
        ah = ah.replace('<link rel="stylesheet" href="admin.css">', '<style>\n' + ac + '\n</style>')
        ah = ah.replace('<script src="admin.js"></script>', '<script>\n' + aj + '\n</script>')
        aout = os.path.join(ROOT, 'admin.html')
        open(aout, 'w', encoding='utf-8').write(ah)
        print('  -> %s  (%.2f MB)' % (aout, os.path.getsize(aout) / 1024 / 1024))

    left = re.findall(r"@@[A-Z]+:[^@]+@@", html)
    if left:
        print('  ! unresolved tokens:', set(left))

    open(OUT, 'w', encoding='utf-8').write(html)
    total = sum(s[2] for s in stats)
    print('\n  assets embedded:')
    for kind, name, size in stats:
        print('    %-6s %-24s %7.0f KB' % (kind, name, size / 1024))
    print('    %-31s %7.0f KB total' % ('', total / 1024))
    print('  -> %s  (%.2f MB)\n' % (OUT, os.path.getsize(OUT) / 1024 / 1024))


if __name__ == '__main__':
    main()
