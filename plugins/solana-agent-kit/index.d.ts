import type { Plugin } from 'solana-agent-kit';
export interface Terminal7Options { apiKey?: string; baseUrl?: string }
export declare function createTerminal7Plugin(opts?: Terminal7Options): Plugin;
declare const plugin: Plugin;
export default plugin;
