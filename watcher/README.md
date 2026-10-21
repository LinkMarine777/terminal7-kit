# Terminal 7 watcher

A small example of reading the [Terminal 7 data API](https://terminal7.xyz/api): it prints the coins the most Terminal 7
signal families agree on (the TOP 10) when the list changes, and each signal as it fires. It only reads and prints: it
doesn't trade, hold keys or decide anything.

```bash
pip install requests
T7_KEY=t7_YOUR_KEY python t7watch.py
```

Get a free key at https://terminal7.xyz/api (free = data 15 minutes late; Builder = real time). `T7_EVERY` = seconds between checks.

## What the API gives you

- `/v1/top`: the coins the most signal families agree on now
- `/v1/coin/{mint}`: REAL / compound / conviction scores, payout APY, market numbers, recent signals
- `/v1/signals`: every signal family firing, with times

Also an MCP server for AI agents: see https://terminal7.xyz/llms.txt.

Data, not financial advice. What you build on it and any trades you make are your own.
