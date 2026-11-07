---
name: coin
description: Read one stonkfun coin from Terminal 7's data (REAL score and call, compound or conviction, payout APY, market, holders trend, its life since launch, recent signals). Use when the user names a coin by $TICKER or mint address.
argument-hint: <$TICKER or mint address>
allowed-tools: mcp__plugin_terminal7_t7__get_coin mcp__plugin_terminal7_t7__get_signals mcp__plugin_terminal7_t7__get_top mcp__plugin_terminal7_t7__get_launches mcp__plugin_terminal7_t7__get_coins
---

The coin: $ARGUMENTS

1. If it's a mint address (32-44 base58 characters), use it. If it's a ticker, find its mint: look in `get_top`, then
   `get_launches`, then `get_coins` (page with offset, at most 5 pages). Several coins with that ticker: list them
   (mint, market cap, holders) and ask which one. None: ask for the mint address.
2. Call `get_coin` with the mint, and `get_signals` with that mint for its latest signals.
3. Write a short read in plain words: the REAL score and call, compound (reward coins) or conviction (others), what it
   pays holders, market cap / holders and their 24 h trend, its life (age, ATH, how far under it, pump-and-dump cycles),
   whether it's in the TOP 10, and the signal families that fired lately. Point out anything that looks like a risk
   (falling holders, few real buyers, far under its ATH, several pump-and-dump cycles) as a fact, not a verdict.

Rules: data, not advice. No emoji. Never say to buy or sell or predict a price.
End with: Data from Terminal 7 (terminal7.xyz/terminal/token?ca=<mint>), not financial advice.
