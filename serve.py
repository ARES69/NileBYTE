#!/usr/bin/env python3
"""
Nile Bites — dev server with auto-rebuild.
Serves the folder on :8000 and rebuilds index.html/admin.html whenever src/* changes.
Usage: python3 serve.py [port]
"""
import http.server, functools, os, subprocess, sys, threading, time

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


def mtimes():
    out = {}
    for f in os.listdir(SRC):
        p = os.path.join(SRC, f)
        if os.path.isfile(p):
            out[p] = os.path.getmtime(p)
    return out


def rebuild():
    subprocess.run([sys.executable, os.path.join(ROOT, 'build.py')],
                   cwd=ROOT, stdout=subprocess.DEVNULL)
    print('  [serve] rebuilt', time.strftime('%H:%M:%S'))


def watcher():
    last = mtimes()
    while True:
        time.sleep(0.8)
        now = mtimes()
        if now != last:
            last = now
            try:
                rebuild()
            except Exception as e:
                print('  [serve] build error:', e)


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print('  [http] %s %s' % (self.command, self.path))


def main():
    threading.Thread(target=watcher, daemon=True).start()
    httpd = http.server.ThreadingHTTPServer(('0.0.0.0', PORT), functools.partial(Handler, directory=ROOT))
    print('Nile Bites dev server:  http://localhost:%d/' % PORT)
    print('  site:   /index.html')
    print('  admin:  /admin.html   (PIN 2026)')
    print('  hub:    /HUB.html')
    print('  edit src/* -> auto-rebuild on save. Ctrl+C to stop.')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nbye')


if __name__ == '__main__':
    main()
