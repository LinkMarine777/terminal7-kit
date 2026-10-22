# @terminal7/plugin-solana-agent-kit

[Terminal 7](https://terminal7.xyz) data for [Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit): signals, scores and
holder payouts for stonkfun coins on Solana. Read-only: it fetches data and never signs or sends a transaction.

```bash
npm install @terminal7/plugin-solana-agent-kit
```

```js
import { SolanaAgentKit } from 'solana-agent-kit';
import { createTerminal7Plugin } from '@terminal7/plugin-solana-agent-kit';

const agent = new SolanaAgentKit(wallet, rpcUrl, {}).use(createTerminal7Plugin({ apiKey: process.env.T7_API_KEY }));

const top = await agent.methods.t7Top(agent);                  // the TOP 10
const coin = await agent.methods.t7Coin(agent, '<mint>');      // one coin's scores and payouts
const sig = await agent.methods.t7Signals(agent, { limit: 50 }); // signals firing, with times
const news = await agent.methods.t7Launches(agent, { call: 'REAL' }); // new launches from the launch radar
const mood = await agent.methods.t7Mood(agent);                // the meme market mood, 0-100
const all = await agent.methods.t7Coins(agent, { offset: 0 });  // every coin Terminal 7 scores, paged
```

Actions for LLM tools (`createVercelAITools`, `createLangchainTools`, `createOpenAITools`): `T7_TOP_SIGNALS`, `T7_COIN`, `T7_SIGNALS`, `T7_LAUNCHES`, `T7_MOOD`.

Get a key at https://terminal7.xyz/api (free: 15 minutes behind; Builder: real time). The key can also come from `T7_API_KEY`.

Every call, its fields, examples and limits: https://terminal7.xyz/docs/

Data, not financial advice. What your agent does with it is yours.
