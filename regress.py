#!/usr/bin/env python3
"""
Nile Bites — final regression run.
Modes: desktop EN (all sections + key modals), mobile EN, desktop AR (RTL), desktop RU.
Checks: page errors, console errors, broken images, horizontal overflow per mode.
Outputs: shots/regress/*.png + contact sheets shots/regress-*.jpg
"""
import os
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'shots', 'regress')
os.makedirs(OUT, exist_ok=True)
URL = 'file://' + os.path.join(ROOT, 'index.html')

SCROLL_JS = """sel => {
  const el = document.querySelector(sel);
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const y = r.top + window.scrollY - Math.max(0, (window.innerHeight - r.height) / 2);
  window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
  return true;
}"""

errors = {'page': [], 'console': [], 'img': [], 'overflow': []}


def hook(page, tag):
    page.on('pageerror', lambda e: errors['page'].append(tag + ': ' + str(e)[:200]))
    page.on('console', lambda m: errors['console'].append(tag + ': ' + m.text[:200]) if m.type == 'error' else None)


def shoot(page, sel, name, wait=750):
    ok = page.evaluate(SCROLL_JS, sel)
    page.wait_for_timeout(wait)
    page.screenshot(path=os.path.join(OUT, name + '.png'))
    print('  %-28s %s' % (name, '' if ok else '(selector missing!)'))
    if not ok:
        errors['page'].append(name + ': selector missing ' + sel)


def checks(page, tag):
    # force-load lazy images: sweep the page, then back to top
    page.evaluate("""async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += window.innerHeight * 0.8) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 60)); }
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 400));
    }""")
    bad = page.evaluate("Array.from(document.images).filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src.slice(0, 60))")
    if bad:
        errors['img'].append(tag + ': ' + str(bad))
    ow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
    if ow > 2:
        errors['overflow'].append('%s: +%dpx horizontal' % (tag, ow))
    print('  [%s] broken-imgs:%d h-overflow:%dpx' % (tag, len(bad), ow))


def sheet(names, path, cols=4, tw=460, th=290):
    rows = (len(names) + cols - 1) // cols
    sh = Image.new('RGB', (cols * tw, rows * (th + 18)), (15, 13, 10))
    d = ImageDraw.Draw(sh)
    for i, n in enumerate(names):
        f = os.path.join(OUT, n + '.png')
        if not os.path.exists(f):
            continue
        im = Image.open(f).convert('RGB')
        im.thumbnail((tw, th))
        x, y = (i % cols) * tw, (i // cols) * (th + 18)
        sh.paste(im, (x + (tw - im.width) // 2, y))
        d.text((x + 6, y + th + 3), n, fill=(230, 220, 200))
    sh.save(path, quality=82)
    print('sheet ->', os.path.basename(path))


def main():
    with sync_playwright() as pw:
        browser = pw.chromium.launch()

        # ---------------- desktop EN ----------------
        p = browser.new_page(viewport={'width': 1512, 'height': 945})
        hook(p, 'en')
        p.goto(URL)
        p.wait_for_timeout(5200)
        for sel, name in [
            ('#hero', 'en-01-hero'), ('#cup', 'en-02-cup'), ('#bites', 'en-03-bites'),
            ('#builder', 'en-04-builder'), ('#sauces', 'en-05-sauces'), ('#story', 'en-06-nile'),
            ('#delivery', 'en-07-tourists'), ('#locations', 'en-08-locations'), ('#feed', 'en-09-feed'),
            ('#ugc', 'en-10-ugc'), ('#packaging', 'en-11-packaging'), ('#franchise', 'en-12-franchise'),
            ('#club', 'en-13-club'), ('#careers', 'en-14-careers'), ('#invest', 'en-15-invest'),
            ('.cta', 'en-16-cta'), ('.footer', 'en-17-footer'),
        ]:
            shoot(p, sel, name)
        # modals
        p.evaluate(SCROLL_JS, '#builder')
        p.click('#addToOrder')
        p.wait_for_timeout(500)
        p.screenshot(path=os.path.join(OUT, 'en-18-checkout.png'))
        p.keyboard.press('Escape')
        p.wait_for_timeout(300)
        p.evaluate(SCROLL_JS, '#invest')
        p.fill('#invCode', 'NILE-2029')
        p.click('#invUnlock')
        p.wait_for_timeout(500)
        p.screenshot(path=os.path.join(OUT, 'en-19-investor-open.png'))
        checks(p, 'desktop-en')
        p.close()

        # ---------------- mobile EN ----------------
        m = browser.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        hook(m, 'mob')
        m.goto(URL)
        m.wait_for_timeout(5200)
        for sel, name in [
            ('#hero', 'mo-01-hero'), ('#bites', 'mo-02-bites'), ('#builder', 'mo-03-builder'),
            ('#locations', 'mo-04-locations'), ('#club', 'mo-05-club'), ('#careers', 'mo-06-careers'),
        ]:
            shoot(m, sel, name)
        m.click('#burger')
        m.wait_for_timeout(600)
        m.screenshot(path=os.path.join(OUT, 'mo-07-menu.png'))
        m.click('#burger')
        m.wait_for_timeout(300)
        checks(m, 'mobile-en')
        m.close()

        # ---------------- desktop AR ----------------
        r = browser.new_page(viewport={'width': 1512, 'height': 945})
        hook(r, 'ar')
        r.goto(URL)
        r.wait_for_timeout(5200)
        r.click('.lang__btn[data-lang="ar"]')
        r.wait_for_timeout(700)
        for sel, name in [
            ('#hero', 'ar-01-hero'), ('#bites', 'ar-02-bites'), ('#builder', 'ar-03-builder'),
            ('#locations', 'ar-04-locations'), ('#club', 'ar-05-club'), ('.footer', 'ar-06-footer'),
        ]:
            shoot(r, sel, name)
        checks(r, 'desktop-ar')
        r.close()

        # ---------------- desktop RU ----------------
        u = browser.new_page(viewport={'width': 1512, 'height': 945})
        hook(u, 'ru')
        u.goto(URL)
        u.wait_for_timeout(5200)
        u.click('.lang__btn[data-lang="ru"]')
        u.wait_for_timeout(700)
        for sel, name in [
            ('#hero', 'ru-01-hero'), ('#delivery', 'ru-02-tourists'),
            ('#careers', 'ru-03-careers'), ('#invest', 'ru-04-invest'),
        ]:
            shoot(u, sel, name)
        checks(u, 'desktop-ru')
        u.close()
        browser.close()

    en = [n for n in sorted(os.listdir(OUT)) if n.startswith('en-')]
    mo = [n for n in sorted(os.listdir(OUT)) if n.startswith('mo-')]
    ar = [n for n in sorted(os.listdir(OUT)) if n.startswith('ar-')]
    ru = [n for n in sorted(os.listdir(OUT)) if n.startswith('ru-')]
    sheet([n[:-4] for n in en], os.path.join(ROOT, 'shots', 'regress-desktop-en.jpg'), cols=4)
    sheet([n[:-4] for n in mo], os.path.join(ROOT, 'shots', 'regress-mobile.jpg'), cols=4)
    sheet([n[:-4] for n in ar], os.path.join(ROOT, 'shots', 'regress-desktop-ar.jpg'), cols=3)
    sheet([n[:-4] for n in ru], os.path.join(ROOT, 'shots', 'regress-desktop-ru.jpg'), cols=4)

    print('\n================ REGRESSION REPORT ================')
    ok = True
    for k in ('page', 'console', 'img', 'overflow'):
        if errors[k]:
            ok = False
            print('FAIL %s:' % k)
            for e in errors[k]:
                print('   -', e)
        else:
            print('PASS %s: clean' % k)
    print('shots: %d | sheets: 4' % len(os.listdir(OUT)))
    print('RESULT:', 'ALL GREEN' if ok else 'SEE FAILS ABOVE')


if __name__ == '__main__':
    main()
