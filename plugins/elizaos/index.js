// Terminal 7 plugin for ElizaOS: read-only data actions (TOP 10, coin scores, signals). It never trades or signs.
import { t7Client, findMint, topText, coinText, signalsText } from './t7.js';

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

export const terminal7Plugin = {
  name: 'terminal7',
  description: 'Terminal 7 data for stonkfun coins on Solana: TOP 10, REAL / compound / conviction scores, holder payouts, signals. Read-only.',
  config: { T7_API_KEY: null, T7_API_URL: null },
  actions: [top, coin, signals],
  providers: [],
};

export default terminal7Plugin;
