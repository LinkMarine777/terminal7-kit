# @terminal7/plugin-elizaos

[Terminal 7](https://terminal7.xyz) data for [ElizaOS](https://github.com/elizaOS/eliza) agents: signals, scores and holder payouts for
stonkfun coins on Solana. Read-only: it fetches data and never signs or sends a transaction.

```bash
npm install @terminal7/plugin-elizaos
```

Add it to your character and set the key (`.env` or the character's secrets):

```json
{ "plugins": ["@terminal7/plugin-elizaos"], "settings": { "secrets": { "T7_API_KEY": "t7_..." } } }
```

Actions: `T7_TOP_SIGNALS` (the TOP 10), `T7_COIN` (one coin by the mint address in the message), `T7_SIGNALS` (the latest signals,
optionally for one coin).

Get a key at https://terminal7.xyz/api (free: 15 minutes behind; Builder: real time).

Data, not financial advice. What your agent does with it is yours.
