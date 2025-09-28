import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const DEFAULT_ENDPOINT = "https://mcp.context7.com/mcp";

let connectionPromise: Promise<Client> | null = null;

export async function getMcpClient(): Promise<Client> {
	if (connectionPromise) {
		return connectionPromise;
	}

	return (connectionPromise = connectToMcp());
}

async function connectToMcp(): Promise<Client> {
	const endpoint = process.env.CONTEXT7_ENDPOINT ?? DEFAULT_ENDPOINT;
	const apiKey = process.env.CONTEXT7_API_KEY;

	if (!apiKey) {
		throw new Error(
			"CONTEXT7_API_KEY is not set. Please configure it in the environment before using Context7 tools.",
		);
	}

	const transport = new StreamableHTTPClientTransport(new URL(endpoint), {
		requestInit: {
			headers: {
				CONTEXT7_API_KEY: apiKey,
			},
		},
	});

	const client = new Client(
		{
			name: "ai-sdk-mcp-wrapper",
			version: "1.0.0",
		},
		{ capabilities: {} },
	);

	await client.connect(transport);
	return client;
}

export async function closeMcpClient(): Promise<void> {
	if (!connectionPromise) {
		return;
	}

	const client = await connectionPromise;
	await client.close();
	connectionPromise = null;
}
