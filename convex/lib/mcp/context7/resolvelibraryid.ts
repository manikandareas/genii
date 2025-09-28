import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { tool } from "ai";
import { z } from "zod";

// Auto-generated wrapper for MCP tool: resolve-library-id
// Source: https://mcp.context7.com/mcp
export const resolvelibraryidToolWithClient = (
	getClient: () => Promise<Client> | Client,
) =>
	tool({
		description: `Resolves a package/product name to a Context7-compatible library ID and returns a list of matching libraries.

You MUST call this function before 'get-library-docs' to obtain a valid Context7-compatible library ID UNLESS the user explicitly provides a library ID in the format '/org/project' or '/org/project/version' in their query.

Selection Process:
1. Analyze the query to understand what library/package the user is looking for
2. Return the most relevant match based on:
- Name similarity to the query (exact matches prioritized)
- Description relevance to the query's intent
- Documentation coverage (prioritize libraries with higher Code Snippet counts)
- Trust score (consider libraries with scores of 7-10 more authoritative)

Response Format:
- Return the selected library ID in a clearly marked section
- Provide a brief explanation for why this library was chosen
- If multiple good matches exist, acknowledge this but proceed with the most relevant one
- If no good matches exist, clearly state this and suggest query refinements

For ambiguous queries, request clarification before proceeding with a best-guess match.`,
		inputSchema: z
			.object({
				libraryName: z
					.string()
					.describe(
						"Library name to search for and retrieve a Context7-compatible library ID.",
					),
			})
			.strict(),
		execute: async (args): Promise<string> => {
			const client = await getClient();
			const result = await client.callTool({
				name: "resolve-library-id",
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
