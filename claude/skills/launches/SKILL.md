---
name: launches
description: Show new stonkfun launches from Terminal 7's launch radar (score, call REAL / WATCH / THIN / FARM, market cap and peak, holders, flags) and the newest pairs. Use when the user asks about new launches, new coins or new pairs.
argument-hint: "[REAL | WATCH | min score]"
allowed-tools: mcp__plugin_terminal7_t7__get_launches
---

Filter asked for: $ARGUMENTS (a call like REAL or WATCH, or a number = minimum score; empty = everything).

Call `get_launches` (call / min_score from the filter, limit 25). Show a short table: $TICKER, call + score, market
cap (peak), holders, age, flags. Then the newest pairs in one line. A flag such as BUNDLED or PUMP & DUMP is a warning:
say what it means in a few words. If the answer has a delay (a free key), say so.

Rules: data, not advice. No emoji. Never say to buy or sell.
End with: Data from Terminal 7 (terminal7.xyz/launches/), not financial advice.
