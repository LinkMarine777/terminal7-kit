#!/usr/bin/env python3
"""Terminal 7 watcher: prints Terminal 7's data on stonkfun coins as it changes.

It reads data and prints it. It doesn't trade, hold keys or make decisions: what you do with the data is yours.

  pip install requests
  T7_KEY=t7_... python t7watch.py          # a free key: https://terminal7.xyz/api

Data, not financial advice. Free keys see data 15 minutes late; a Builder key is real time.
"""
import os, sys, time
import requests

API = os.environ.get('T7_API', 'https://api.terminal7.xyz/v1')
KEY = os.environ.get('T7_KEY', '')
EVERY = int(os.environ.get('T7_EVERY', '120'))   # seconds between checks (a free key allows 30 requests a minute)
H = {'Authorization': 'Bearer ' + KEY, 'User-Agent': 't7-watcher/1'}


def t7(path, **params):
    r = requests.get(API + path, headers=H, params=params, timeout=20)
    if r.status_code == 429:
        print('rate limited, waiting a minute'); time.sleep(60); return t7(path, **params)
    r.raise_for_status()
    return r.json()


def usd(v):
    if not v: return '-'
    return f'${v / 1e6:.1f}M' if v >= 1e6 else f'${v / 1e3:.0f}K'


def show_top(top):
    print(time.strftime('%H:%M:%S'), 'TOP 10 (the coins the most signal families agree on)')
    for i, c in enumerate(top, 1):
        ch = c.get('h24')
        print(f"  {i:>2}. ${c.get('s') or c['m'][:6]:<10} mc {usd(c.get('mc')):>7}  liq {usd(c.get('liq')):>6}  "
              f"24h {'-' if ch is None else f'{ch:+.0f}%':>6}  families: {', '.join(c.get('f') or [])}")


def main():
    if not KEY.startswith('t7_'):
        sys.exit('Set T7_KEY to your key from https://terminal7.xyz/api')
    me = t7('/me')
    print(f"Terminal 7 watcher · plan {me['tier']} ({'15 min behind' if me['delay'] else 'real time'})")
    since, last = None, None
    while True:
        try:
            top = t7('/top').get('top', [])
            ids = [c['m'] for c in top]
            if ids != last: show_top(top); last = ids
            ev = t7('/signals', **({'since': since} if since else {'limit': 20})).get('events', [])
            for e in ev:
                print(f"  {time.strftime('%H:%M', time.localtime(e['t']))}  {e.get('a', 'signal'):<10} "
                      f"{e.get('f', ''):<8} ${e.get('s') or e['m'][:6]}")
            if ev: since = ev[-1]['t']
        except Exception as e:
            print('check failed:', e)
        time.sleep(EVERY)


if __name__ == '__main__':
    main()
