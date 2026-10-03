#!/usr/bin/env python3
"""
Port i18n dictionaries from the concept prototype into production next-intl messages.
Parses data-en / data-ar / data-ru attributes from nilebites/src/index.html
→ production/src/messages/{en,ar,ru}.json (flat keys, slugified EN value).
Missing RU falls back to EN (tourist layer rule).
"""
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC_HTML = os.path.join(ROOT, '..', '..', 'src', 'index.html')
OUT = os.path.join(ROOT, '..', 'src', 'messages')
os.makedirs(OUT, exist_ok=True)

tag_re = re.compile(r'<[a-zA-Z][^>]*data-en="[^"]*"[^>]*>')
en_re = re.compile(r'data-en="([^"]*)"')
ar_re = re.compile(r'data-ar="([^"]*)"')
ru_re = re.compile(r'data-ru="([^"]*)"')


def keyify(en: str) -> str:
    k = re.sub(r'[^0-9a-zA-Z]+', '_', en.strip().lower()).strip('_')
    return k[:64] or 'key'


html_text = open(SRC_HTML, encoding='utf-8').read()
en_map, ar_map, ru_map = {}, {}, {}
used = {}
for tag in tag_re.findall(html_text):
    en = html.unescape(en_re.search(tag).group(1))
    ar_m = ar_re.search(tag)
    ru_m = ru_re.search(tag)
    ar = html.unescape(ar_m.group(1)) if ar_m else en
    ru = html.unescape(ru_m.group(1)) if ru_m else en
    k = keyify(en)
    if k in used and used[k] != en:
        k = k + '_' + str(len(used))
    used[k] = en
    en_map[k] = en
    ar_map[k] = ar
    ru_map[k] = ru

for name, data in (('en', en_map), ('ar', ar_map), ('ru', ru_map)):
    path = os.path.join(OUT, name + '.json')
    json.dump(data, open(path, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)
    print('wrote', path, len(data), 'keys')
