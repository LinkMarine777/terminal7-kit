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

Actions: `T7_TOP_SIGNALS` (the TOP 10), `T7_COIN` (one coin by the mint address in the message: scores, payouts, holder trend, its whole life),
`T7_SIGNALS` (the latest signals, optionally for one coin), `T7_LAUNCHES` (new launches from the launch radar; "real" in the message = only REAL calls),
`T7_MOOD` (the meme market mood, 0-100).

Get a key at https://terminal7.xyz/api (free: 15 minutes behind; Builder: real time).

Every call, its fields, examples and limits: https://terminal7.xyz/docs/

Data, not financial advice. What your agent does with it is yours.
