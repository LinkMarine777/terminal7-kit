// Terminal 7 data API client: the source copy. Each plugin carries it as t7.js (copy it over after a change).
const DEF = 'https://api.terminal7.xyz/v1';
const MINT = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function t7Client({ apiKey, baseUrl } = {}) {
  const base = (baseUrl || DEF).replace(/\/$/, '');
  async function get(path, params) {
    const u = new URL(base + path);
    for (const [k, v] of Object.entries(params || {})) if (v != null && v !== '') u.searchParams.set(k, String(v));
    const h = { accept: 'application/json', 'user-agent': 't7-plugin/1' };
    if (apiKey) h.authorization = 'Bearer ' + apiKey;
    const r = await fetch(u, { headers: h });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`Terminal 7 ${r.status}: ${j.error || r.statusText}`);
    return j;
  }
  return {
    top: () => get('/top'),
    coin: mint => { if (!MINT.test(mint || '')) throw new Error('a Solana mint address is needed'); return get('/coin/' + mint); },
    signals: ({ mint, since, before, limit } = {}) => get('/signals', { mint, since, before, limit }),
    launches: ({ call, min_score, limit } = {}) => get('/launches', { call, min_score, limit }),
    mood: () => get('/mood'),
    coins: ({ offset, limit } = {}) => get('/coins', { offset, limit }),
    me: () => get('/me'),
  };
}

export const findMint = text => (String(text || '').match(/[1-9A-HJ-NP-Za-km-z]{32,44}/g) || []).find(x => MINT.test(x)) || null;

const usd = v => v == null ? '-' : v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `$${Math.round(v / 1e3)}K` : `$${Math.round(v)}`;
const pct = v => v == null ? '-' : `${v > 0 ? '+' : ''}${Math.round(v)}%`;
const NOTE = 'Data from Terminal 7 (terminal7.xyz), not financial advice.';

export function topText(j) {
  const t = j.top || [];
  if (!t.length) return 'Terminal 7 has no TOP 10 right now.';
  return ['Terminal 7 TOP 10 (the coins the most signal families agree on):',
    ...t.map((c, i) => `${i + 1}. $${c.s || c.m.slice(0, 6)} (${c.m}) mc ${usd(c.mc)}, liq ${usd(c.liq)}, 24h ${pct(c.h24)}, families: ${(c.f || []).join(', ') || '-'}`),
    j.delay ? `(free key: ${Math.round(j.delay / 60)} minutes behind)` : '', NOTE].filter(Boolean).join('\n');
}

export function coinText(c) {
  const l = [`Terminal 7 on $${c.symbol || '?'} (${c.mint}):`];
  if (c.top10) l.push(`TOP 10 rank ${c.top10.rank} (${(c.top10.families || []).join(', ')})`);
  if (c.real) l.push(`REAL score ${c.real.score}${c.real.call ? ` (${c.real.call})` : ''}`);
  if (c.compound) l.push(`compound score ${c.compound.score ?? '-'}${c.compound.d7 != null ? `, 7d ${c.compound.d7}` : ''}`);
  if (c.conviction) l.push(`conviction score ${c.conviction.score ?? '-'}`);
  if (c.radar) l.push(`launch radar ${c.radar.score ?? '-'}${c.radar.call ? ` (${c.radar.call})` : ''}`);
  if (c.payouts) l.push(`payouts: APY 7d ${c.payouts.apy7d ?? '-'}%, paid ${usd(c.payouts.paidUsd)}, Stonk Board rank ${c.payouts.boardRank ?? '-'}`);
  if (c.market) l.push(`market: mc ${usd(c.market.mcap)}, 24h ${pct(c.market.chg24)}, holders ${c.market.holders ?? '-'}`);
  if (c.trend) l.push(`trend: holders 24h ${pct(c.trend.holders24hPct)}, real buyers 24h ${c.trend.organicBuyers24h ?? '-'}, price 1h ${pct(c.trend.price1hPct)}`);
  if (c.life) l.push(`life: ${c.life.ageDays ?? '-'} days old, ATH ${usd(c.life.athMcap)} ${c.life.athDaysAgo ?? '-'} days ago, ${c.life.offAthPct ?? '-'}% under it, ${c.life.pumps ?? 0} pump-and-dump cycles`);
  if (c.recent?.length) l.push(`recent signals: ${c.recent.slice(-5).map(e => e.f).join(', ')}`);
  if (l.length === 1) l.push('nothing scored on this coin yet.');
  return [...l, NOTE].join('\n');
}

export function signalsText(j) {
  const e = (j.events || []).slice(-15);
  if (!e.length) return 'No Terminal 7 signals in that window.';
  return ['Terminal 7 signals (newest last):',
    ...e.map(x => `${new Date(x.t * 1000).toISOString().slice(11, 16)} UTC  ${x.a}  ${x.f}  $${x.s || x.m.slice(0, 6)}`), NOTE].join('\n');
}

export function launchesText(j) {
  const l = (j.launches || []).slice(0, 15);
  if (!l.length) return 'No new launches on the Terminal 7 radar in that view.';
  return ['Terminal 7 launch radar (newest first):',
    ...l.map(x => `$${x.symbol || x.mint.slice(0, 6)} (${x.mint}) ${x.call || '-'} ${x.score ?? '-'}, mc ${usd(x.mcap)} (peak ${usd(x.peakMcap)}), holders ${x.holders ?? '-'}${(x.flags || []).length ? ', ' + x.flags.join(', ') : ''}`),
    j.delay ? `(free key: ${Math.round(j.delay / 60)} minutes behind)` : '', NOTE].filter(Boolean).join('\n');
}

export function moodText(j) {
  const m = j.mood;
  if (!m || m.score == null) return 'Terminal 7 has no market mood reading right now.';
  return [`Terminal 7 meme market mood: ${Math.round(m.score)}/100 (${m.band})`,
    m.medianCoin24hPct != null ? `median stonkfun coin over 24h: ${pct(m.medianCoin24hPct)} across ${m.coins ?? '-'} coins` : '',
    m.cryptoFearGreed != null ? `crypto Fear & Greed: ${m.cryptoFearGreed}` : '', NOTE].filter(Boolean).join('\n');
}
