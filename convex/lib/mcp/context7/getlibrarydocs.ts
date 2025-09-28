import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { tool } from "ai";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: get-library-docs
// Source: https://mcp.context7.com/mcp
export const getlibrarydocsToolWithClient = (
	getClient: () => Promise<Client> | Client,
) =>
	tool({
		description: `Fetches up-to-date documentation for a library. You must call 'resolve-library-id' first to obtain the exact Context7-compatible library ID required to use this tool, UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query.`,
		inputSchema: z
			.object({
				context7CompatibleLibraryID: z
					.string()
					.describe(
						`Exact Context7-compatible library ID (e.g., '/mongodb/docs', '/vercel/next.js', '/supabase/supabase', '/vercel/next.js/v14.3.0-canary.87') retrieved from 'resolve-library-id' or directly from user query in the format '/org/project' or '/org/project/version'.`,
					),
				topic: z
					.string()
					.describe(
						"Topic to focus documentation on (e.g., 'hooks', 'routing').",
					)
					.optional(),
				tokens: z
					.number()
					.describe(
						`Maximum number of tokens of documentation to retrieve (default: 5000). Higher values provide more context but consume more tokens.`,
					)
					.optional(),
			})
			.strict(),
		execute: async (args): Promise<string> => {
			const client = await getClient();
			const result = await client.callTool({
				name: "get-library-docs",
				arguments: args,
			});

			// Handle different content types from MCP
			if (Array.isArray(result.content)) {
				return result.content
					.map((item: unknown) =>
						typeof item === "string" ? item : JSON.stringify(item),
					)
					.join("\n");
			} else if (typeof result.content === "string") {
				return result.content;
			} else {
				return JSON.stringify(result.content);
			}
		},
	});
