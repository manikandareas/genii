import { createClerkClient } from "@clerk/backend";
import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const embedText = async (text: string) => {
  const { embedding } = await embed({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    value: text,
  });

  return embedding;
};

export const embedTextBatch = async (texts: string[]) => {
  const { embeddings } = await embedMany({
    model: openai.textEmbeddingModel("text-embedding-3-small"),
    values: texts,
  });

  return embeddings;
};
