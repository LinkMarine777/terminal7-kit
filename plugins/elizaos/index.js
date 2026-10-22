// Terminal 7 plugin for ElizaOS: read-only data actions (TOP 10, coin scores, signals, launches, market mood). It never trades or signs.
import { t7Client, findMint, topText, coinText, signalsText, launchesText, moodText } from './t7.js';

const api = rt => t7Client({ apiKey: rt.getSetting('T7_API_KEY') || undefined, baseUrl: rt.getSetting('T7_API_URL') || undefined });
const hasKey = async rt => !!rt.getSetting('T7_API_KEY');

function action(name, description, similes, example, fetchText) {
  return {
    name, description, similes, validate: hasKey,
    handler: async (rt, message, _state, _opts, callback) => {
      try {
        const { text, data } = await fetchText(rt, message);
        if (callback) await callback({ text, actions: [name] });
        return { success: true, text, data };
      } catch (e) {
        const text = `Terminal 7: ${e.message}`;
        if (callback) await callback({ text, actions: [name] });
        return { success: false, text, error: e.message };
      }
    },
    examples: [[{ name: '{{user1}}', content: { text: example } }, { name: '{{agentName}}', content: { text: 'Checking Terminal 7.', actions: [name] } }]],
  };
}

const top = action('T7_TOP_SIGNALS',
  'List the stonkfun coins on Solana the most Terminal 7 signal families agree on now (TOP 10). Read-only data, not advice.',
  ['TERMINAL7_TOP', 'TOP_SIGNALS', 'STONKFUN_TOP'], 'What are the top Terminal 7 signals right now?',
  async rt => { const d = await api(rt).top(); return { data: d, text: topText(d) }; });

const coin = action('T7_COIN',
  'Terminal 7 scores for one Solana coin by its mint address in the message: REAL, compound or conviction, holder payouts, launch radar, TOP 10 rank, recent signals.',
  ['TERMINAL7_COIN', 'COIN_SCORE', 'IS_IT_REAL'], 'What does Terminal 7 say about F8Sc8HoZvJcMrTY6vBsetTqGPv6XQmM2XgVAZo1sSTNK?',
  async (rt, m) => { const mint = findMint(m?.content?.text); if (!mint) throw new Error('send the coin\'s mint address'); const d = await api(rt).coin(mint); return { data: d, text: coinText(d) }; });

const signals = action('T7_SIGNALS',
  'The latest Terminal 7 signals firing on stonkfun coins, with times; for one coin when its mint address is in the message.',
  ['TERMINAL7_SIGNALS', 'LATEST_SIGNALS'], 'Any new Terminal 7 signals?',
  async (rt, m) => { const d = await api(rt).signals({ mint: findMint(m?.content?.text) || undefined, limit: 50 }); return { data: d, text: signalsText(d) }; });

const launches = action('T7_LAUNCHES',
  'New stonkfun launches from the Terminal 7 launch radar, newest first: score and call (REAL / WATCH / THIN / FARM), market cap, peak, holders, flags. Say "real" to see only REAL calls.',
  ['TERMINAL7_LAUNCHES', 'NEW_LAUNCHES', 'LAUNCH_RADAR'], 'Any new REAL launches on Terminal 7?',
  async (rt, m) => { const d = await api(rt).launches({ call: /\breal\b/i.test(m?.content?.text || '') ? 'REAL' : undefined, limit: 15 }); return { data: d, text: launchesText(d) }; });

const mood = action('T7_MOOD',
  'The meme market mood for stonkfun coins from Terminal 7: 0-100 (cold under 40, hot 60 and over), the median coin\'s move, the crypto Fear & Greed index.',
  ['TERMINAL7_MOOD', 'MARKET_MOOD', 'MEME_SENTIMENT'], 'How is the stonkfun market feeling today?',
  async rt => { const d = await api(rt).mood(); return { data: d, text: moodText(d) }; });

export const terminal7Plugin = {
  name: 'terminal7',
  description: 'Terminal 7 data for stonkfun coins on Solana: TOP 10, REAL / compound / conviction scores, holder payouts, signals, new launches, market mood. Read-only.',
  config: { T7_API_KEY: null, T7_API_URL: null },
  actions: [top, coin, signals, launches, mood],
  providers: [],
};

export default terminal7Plugin;
