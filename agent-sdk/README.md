# Terminal 7 brief (Claude Agent SDK)

A small [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk-python) agent that reads the
[Terminal 7 data API](https://terminal7.xyz/api) through its MCP server and writes you a brief: the market mood, the TOP 10
and new launches worth a look. Or ask it anything about stonkfun coins.

It only reads: its only tools are Terminal 7's (no shell, no files, no web, no wallet). It doesn't trade.

```bash
pip install claude-agent-sdk
export T7_KEY=t7_YOUR_KEY             # free at https://terminal7.xyz/api
export ANTHROPIC_API_KEY=sk-ant-...   # or be signed in to Claude Code
python t7brief.py
python t7brief.py 'read $MARINE and tell me how its holders are doing'
```

Run it on a schedule (cron, a GitHub Action) for a brief every morning. The same MCP server works in any agent
framework: `https://api.terminal7.xyz/v1/mcp` with `Authorization: Bearer t7_...`.

Data, not financial advice. Free keys see data 15 minutes late; Builder and up are real time.
