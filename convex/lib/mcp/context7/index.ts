// Auto-generated index file for MCP tools
// Source: https://mcp.context7.com/mcp

import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { getMcpClient } from "./client.js";
import { getlibrarydocsToolWithClient } from "./getlibrarydocs.js";
import { resolvelibraryidToolWithClient } from "./resolvelibraryid.js";

// Exports using a default client
export const mcpContext7Tools = {
	resolvelibraryid: resolvelibraryidToolWithClient(getMcpClient),
	getlibrarydocs: getlibrarydocsToolWithClient(getMcpClient),
} as const;

export const mcpContext7ToolsWithClient = (client: Promise<Client> | Client) =>
	({
		resolvelibraryid: resolvelibraryidToolWithClient(() => client),
		getlibrarydocs: getlibrarydocsToolWithClient(() => client),
	}) as const;

// Individual tool exports
export const resolvelibraryidTool =
	resolvelibraryidToolWithClient(getMcpClient);
export const getlibrarydocsTool = getlibrarydocsToolWithClient(getMcpClient);
