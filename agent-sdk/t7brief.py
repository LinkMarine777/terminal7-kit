#!/usr/bin/env python3
"""Terminal 7 brief: a Claude agent (Claude Agent SDK) that reads Terminal 7's data and writes you a short brief.

It only reads: its one set of tools is Terminal 7's MCP server (no shell, no files, no wallet). It never trades.

  pip install claude-agent-sdk
  export T7_KEY=t7_...                 # a free key: https://terminal7.xyz/api
  export ANTHROPIC_API_KEY=sk-ant-...  # or a signed-in Claude Code
  python t7brief.py                    # the brief: market mood, TOP 10, launches worth a look
  python t7brief.py 'read $MARINE'      # or ask it anything about stonkfun coins

Data, not financial advice. Free keys see data 15 minutes late; Builder and up are real time.
"""
import asyncio, os, sys

from claude_agent_sdk import AssistantMessage, ClaudeAgentOptions, ClaudeSDKClient, ResultMessage, TextBlock

KEY = os.environ.get('T7_KEY', '')
MCP = os.environ.get('T7_MCP', 'https://api.terminal7.xyz/v1/mcp')
TOOLS = ['get_top', 'get_coin', 'get_signals', 'get_launches', 'get_mood', 'get_coins', 'get_usage']

BRIEF = ('Write my Terminal 7 brief for stonkfun coins: 1) the market mood in two lines, 2) the TOP 10 as a short '
         'table with the signal families agreeing, 3) up to 5 new launches with a REAL or WATCH call and any warning '
         'flags. Keep it under 300 words.')

SYSTEM = ('You read Terminal 7 data (terminal7.xyz) about stonkfun coins on Solana with the terminal7 tools and answer '
          'in plain words. To find a coin by $TICKER, look in get_top, then get_launches, then get_coins; if several '
          'coins share it, list them and say which you read. State facts and risks as facts. Never tell the user to buy '
          'or sell and never predict a price. No emoji. If the data is delayed (a free key), say how many minutes. '
          'End with: Data from Terminal 7, not financial advice.')


async def main(ask):
    opts = ClaudeAgentOptions(
        system_prompt=SYSTEM,
        mcp_servers={'terminal7': {'type': 'http', 'url': MCP,
                                   'headers': {'Authorization': 'Bearer ' + KEY}}},
        strict_mcp_config=True,                 # only Terminal 7's server, nothing from your own config
        tools=[],                               # no built-in tools: no shell, no files, no web
        allowed_tools=['mcp__terminal7__' + t for t in TOOLS],
        setting_sources=[],
        max_turns=12,
    )
    async with ClaudeSDKClient(opts) as client:
        # check Terminal 7 took the key before asking Claude anything (no tokens spent on a bad key)
        for _ in range(30):
            st = {x['name']: x for x in (await client.get_mcp_status()).get('mcpServers', [])}.get('terminal7') or {}
            if st.get('status') != 'pending':
                break
            await asyncio.sleep(0.5)
        if st.get('status') != 'connected':
            sys.exit('Terminal 7 refused the key or could not be reached: check T7_KEY (https://terminal7.xyz/api). '
                     + (st.get('error') or ''))
        await client.query(ask)
        async for msg in client.receive_response():
            if isinstance(msg, AssistantMessage):
                for b in msg.content:
                    if isinstance(b, TextBlock):
                        print(b.text)
            elif isinstance(msg, ResultMessage):
                if msg.is_error:
                    sys.exit(f'failed: {msg.result or msg.subtype}')
                if msg.total_cost_usd:
                    print(f'\n(Claude usage: ${msg.total_cost_usd:.3f})')

if __name__ == '__main__':
    if not KEY.startswith('t7_'):
        sys.exit('Set T7_KEY to your key from https://terminal7.xyz/api')
    asyncio.run(main(' '.join(sys.argv[1:]) or BRIEF))
