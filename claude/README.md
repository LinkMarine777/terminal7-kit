# Terminal 7 for Claude Code

The [Terminal 7](https://terminal7.xyz) data API inside Claude Code: the TOP 10, any stonkfun coin's scores, the launch
radar and the market mood. It only reads data: it never trades, signs or holds wallet keys.

## Install

```
/plugin marketplace add LinkMarine777/terminal7-kit
/plugin install terminal7@terminal7-kit
```

Claude Code asks for your key when the plugin is turned on (kept in your system's credential store). Get a free one at
https://terminal7.xyz/api: free keys are 15 minutes behind, Builder ($29) and up are real time.

## Use

| Command | What |
|---|---|
| `/terminal7:top` | the TOP 10: the coins the most signal families agree on |
| `/terminal7:coin $TICKER` (or a mint) | one coin: REAL, compound / conviction, payouts, holders, its life, recent signals |
| `/terminal7:launches [REAL]` | new launches from the launch radar, and the newest pairs |
| `/terminal7:mood` | the meme market mood, 0-100 |

Or just ask ("what's firing on stonkfun?", "read $MARINE for me"): Claude uses the Terminal 7 tools on its own
(`get_top`, `get_coin`, `get_signals`, `get_launches`, `get_mood`, `get_coins`, `get_usage`).

Data, not financial advice. Terms: https://terminal7.xyz/terms/
