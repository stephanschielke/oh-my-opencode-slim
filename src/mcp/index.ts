import type { McpName, WebsearchConfig } from '../config';
import { context7 } from './context7';
import { gh_grep } from './grep-app';
import type { McpConfig } from './types';
import { createWebsearchConfig, websearch } from './websearch';

export type { LocalMcpConfig, McpConfig, RemoteMcpConfig } from './types';

const allBuiltinMcps: Record<McpName, McpConfig> = {
  websearch,
  context7,
  gh_grep,
};

/**
 * Creates MCP configurations, excluding disabled ones.
 * Accepts an optional websearchConfig to override the default Exa provider.
 */
export function createBuiltinMcps(
  disabledMcps: readonly string[] = [],
  websearchConfig?: WebsearchConfig,
): Record<string, McpConfig> {
  // Never trust the declared type of user-config-derived values at
  // runtime; fall back to "nothing disabled" instead of throwing.
  const safeDisabledMcps = Array.isArray(disabledMcps) ? disabledMcps : [];
  const mcps = Object.fromEntries(
    Object.entries(allBuiltinMcps).filter(
      ([name]) => !safeDisabledMcps.includes(name),
    ),
  );

  // Override websearch with user-configured provider (default: Exa)
  if (!safeDisabledMcps.includes('websearch')) {
    mcps.websearch = createWebsearchConfig(websearchConfig);
  }

  return mcps;
}
