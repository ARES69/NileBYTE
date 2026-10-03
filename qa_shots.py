#!/usr/bin/env python3
"""QA: screenshots of the Nile Bites concept (desktop / mobile / RTL)."""
import os, sys, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'shots')
os.makedirs(OUT, exist_ok=True)
URL = 'file://' + os.path.join(ROOT, 'index.html')


def shot(page, name, **kw):
    p = os.path.join(OUT, name + '.png')
    page.screenshot(path=p, **kw)
    print('  shot', name)


def main():
    with sync_playwright() as pw:
        browser = pw.chromium.launch()

        # ---------- desktop ----------
        d = browser.new_page(viewport={'width': 1512, 'height': 945}, device_scale_factor=1)
        d.on('console', lambda m: print('  [console]', m.type, m.text) if m.type == 'error' else None)
        d.on('pageerror', lambda e: print('  [pageerror]', e))
        d.goto(URL)
        d.wait_for_timeout(1200)
        shot(d, '00-intro')
        d.wait_for_timeout(4200)          # let the intro finish
        d.wait_for_timeout(900)
        shot(d, '01-hero')
        for name, sel in [
            ('02-cup', '#cup'), ('03-bites', '#bites'), ('04-builder', '#builder'),
            ('05-sauces', '#sauces'), ('06-nile', '#story'), ('07-tourists', '#delivery'),
            ('08-locations', '#locations'), ('09-feed', '#feed'), ('10-packaging', '#packaging'),
            ('11-franchise', '#franchise'), ('12-club', '#club'), ('13-footer', '.footer'),
        ]:
            d.eval_on_selector(sel, 'el => el.scrollIntoView({block:"start"})')
            d.wait_for_timeout(900)
            shot(d, name)
        # full page
        d.evaluate("window.scrollTo(0,0)")
        d.wait_for_timeout(500)
        shot(d, '14-desktop-full', full_page=True)

        # ---------- mobile ----------
        m = browser.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2,
                             is_mobile=True, has_touch=True)
        m.goto(URL)
        m.wait_for_timeout(5300)
        shot(m, '20-mobile-hero')
        m.evaluate("document.querySelector('#builder').scrollIntoView()")
        m.wait_for_timeout(900)
        shot(m, '21-mobile-builder')
        m.evaluate("window.scrollTo(0, document.body.scrollHeight * 0.45)")
        m.wait_for_timeout(700)
        shot(m, '22-mobile-mid')
        m.click('#burger')
        m.wait_for_timeout(700)
        shot(m, '23-mobile-menu')
        m.click('#burger')
        m.wait_for_timeout(400)
        shot(m, '24-mobile-full', full_page=True)

        # ---------- RTL ----------
        d.close(); m.close()          # free memory before the third heavy page
        r = browser.new_page(viewport={'width': 1512, 'height': 945})
        r.goto(URL)
        r.wait_for_timeout(5200)
        r.click('.lang__btn[data-lang="ar"]')
        r.wait_for_timeout(800)
        shot(r, '30-rtl-hero')
        r.evaluate("document.querySelector('#builder').scrollIntoView()")
        r.wait_for_timeout(800)
        shot(r, '31-rtl-builder')
        r.evaluate("document.querySelector('#bites').scrollIntoView()")
        r.wait_for_timeout(800)
        shot(r, '32-rtl-bites')

        browser.close()
    print('done')


if __name__ == '__main__':
    main()
