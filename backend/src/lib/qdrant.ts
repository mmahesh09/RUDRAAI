import { QdrantClient } from "@qdrant/js-client-rest";

const url = process.env.QDRANT_URL;
const apiKey = process.env.QDRANT_API_KEY;

export const qdrant: QdrantClient | null = url
  ? new QdrantClient({ url, apiKey })
  : null;

export const COLLECTION_NAME = "rudraai_knowledge";
