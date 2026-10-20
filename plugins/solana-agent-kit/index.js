// Terminal 7 plugin for Solana Agent Kit: read-only data tools (TOP 10, coin scores, signals). It never trades or signs.
import { z } from 'zod';
import { t7Client, topText, coinText, signalsText } from './t7.js';

const keyOf = (opts, agent) => opts.apiKey || agent?.config?.T7_API_KEY || (typeof process !== 'undefined' ? process.env.T7_API_KEY : undefined);
const NOTE = 'Read-only market data from Terminal 7; not financial advice.';

export function createTerminal7Plugin(opts = {}) {
  const api = agent => t7Client({ apiKey: keyOf(opts, agent), baseUrl: opts.baseUrl });
  const methods = {
    t7Top: agent => api(agent).top(),
    t7Coin: (agent, mint) => api(agent).coin(mint),
    t7Signals: (agent, q = {}) => api(agent).signals(q),
    t7Scorecard: agent => api(agent).scorecard(),
  };
  const run = fn => async (agent, input) => {
    try { const { data, text } = await fn(agent, input); return { status: 'success', text, data }; }
    catch (e) { return { status: 'error', message: e.message }; }
  };
  const actions = [
    { name: 'T7_TOP_SIGNALS', similes: ['terminal 7 top 10', 'which stonkfun coins have the most signals', 'top signals now'],
      description: `The stonkfun coins on Solana the most Terminal 7 signal families agree on now (TOP 10), with market cap, liquidity, 24 h change. ${NOTE}`,
      examples: [[{ input: {}, output: { status: 'success', text: 'Terminal 7 TOP 10 ...' }, explanation: 'List the coins Terminal 7 signals agree on' }]],
      schema: z.object({}),
      handler: run(async agent => { const d = await methods.t7Top(agent); return { data: d, text: topText(d) }; }) },
    { name: 'T7_COIN', similes: ['terminal 7 score for a coin', 'is this stonkfun coin real', 'compound score', 'payout apy of a coin'],
      description: `Terminal 7's view of one Solana coin by mint: REAL score, compound or conviction score, holder payouts (APY, paid), launch radar, TOP 10 rank, recent signals. ${NOTE}`,
      examples: [[{ input: { mint: 'F8Sc8HoZvJcMrTY6vBsetTqGPv6XQmM2XgVAZo1sSTNK' }, output: { status: 'success', text: 'Terminal 7 on $MARINE ...' }, explanation: 'Scores and payouts for one coin' }]],
      schema: z.object({ mint: z.string().describe('the coin\'s mint address') }),
      handler: run(async (agent, i) => { const d = await methods.t7Coin(agent, i.mint); return { data: d, text: coinText(d) }; }) },
    { name: 'T7_SIGNALS', similes: ['terminal 7 signals firing', 'latest signals', 'what is terminal 7 seeing'],
      description: `Signal families firing on stonkfun coins (radar, holders, chart, scores, kols, flow, rising, combo) with times, optionally for one coin. ${NOTE}`,
      examples: [[{ input: { limit: 20 }, output: { status: 'success', text: 'Terminal 7 signals ...' }, explanation: 'The latest signals' }]],
      schema: z.object({ mint: z.string().optional(), since: z.number().optional().describe('unix seconds'), limit: z.number().optional() }),
      handler: run(async (agent, i) => { const d = await methods.t7Signals(agent, i || {}); return { data: d, text: signalsText(d) }; }) },
  ];
  return { name: 'terminal7', methods, actions, initialize() {} };
}

export default createTerminal7Plugin();
