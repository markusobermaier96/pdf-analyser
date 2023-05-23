import { PineconeClient } from "@pinecone-database/pinecone";
import { PINECONE_API_KEY, PINECONE_ENVIRONMENT } from "$env/static/private";

if (!PINECONE_ENVIRONMENT || !PINECONE_API_KEY) {
  throw new Error("Pinecone environment or api key vars missing");
}

async function initPinecone() {
  try {
    const pinecone = new PineconeClient();

    await pinecone.init({
      environment: PINECONE_ENVIRONMENT ?? "",
      apiKey: PINECONE_API_KEY ?? "",
    });

    return pinecone;
  } catch (error) {
    console.log("error", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}

export const pinecone = await initPinecone();
