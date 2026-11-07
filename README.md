# Terminal 7 kit

Signals, scores and payout data for stonkfun coins on Solana, for bots, screeners and AI agents.
From [Terminal 7](https://terminal7.xyz): REST, OpenAPI and an MCP server.

- **Get a key:** https://terminal7.xyz/api (sign in with a Solana wallet: a message, not a transaction)
- **Free:** 1,000 requests a day, data 15 minutes behind. **Builder** ($29 / 30 days, USDC): 25,000 a day, real time.
- **Docs:** https://terminal7.xyz/docs/ (every call, example answers, fields, errors and limits)
- **Docs for AI coding tools:** https://terminal7.xyz/llms.txt
- **OpenAPI:** https://api.terminal7.xyz/v1/openapi.json

## What's in here

| Folder | What |
|---|---|
| `watcher/` | a small Python example: prints the TOP 10 when it changes and each signal as it fires |
| `plugins/solana-agent-kit/` | `@terminal7/plugin-solana-agent-kit`: methods + LLM actions for [Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit) |
| `plugins/elizaos/` | `@terminal7/plugin-elizaos`: actions for [ElizaOS](https://github.com/elizaOS/eliza) agents |
| `claude/` | the `terminal7` plugin for [Claude Code](https://claude.com/claude-code): the MCP server + `/terminal7:top`, `:coin`, `:launches`, `:mood` |
| `agent-sdk/` | `t7brief.py`: a [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk-python) agent that writes a brief from the data (read-only tools) |
| `mcp/server.json` | the MCP Registry entry for the remote server `https://api.terminal7.xyz/v1/mcp` |

## MCP (Claude, Cursor, any MCP client)

```json
{ "mcpServers": { "terminal7": { "url": "https://api.terminal7.xyz/v1/mcp", "headers": { "Authorization": "Bearer t7_YOUR_KEY" } } } }
```

Tools: `get_top`, `get_coin`, `get_signals`, `get_launches`, `get_mood`, `get_coins`, `get_usage`.

## Claude Code

```
/plugin marketplace add https://terminal7.xyz/claude/marketplace.json
/plugin install terminal7@terminal7-kit
```

It asks for your key once and keeps it in your system's credential store. Then `/terminal7:top`, `/terminal7:coin $TICKER`,
`/terminal7:launches`, `/terminal7:mood`, or just ask.

## REST

```bash
curl -H "Authorization: Bearer t7_YOUR_KEY" https://api.terminal7.xyz/v1/top
curl -H "Authorization: Bearer t7_YOUR_KEY" https://api.terminal7.xyz/v1/coin/<mint>
curl -H "Authorization: Bearer t7_YOUR_KEY" "https://api.terminal7.xyz/v1/signals?since=<unix seconds>"
```

Every example and plugin here only reads data: none of them trades, signs or holds keys.

## Rules

One key per account. Don't resell the feed or rebroadcast it live (delayed, crediting Terminal 7, is fine).
Data, not financial advice: what you build on it and any trades you make are your own.
Terms: https://terminal7.xyz/terms/

The example code in this repo is MIT licensed (see `LICENSE`); the data itself is under the terms above.
