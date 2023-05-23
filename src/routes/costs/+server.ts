import { error, type RequestHandler } from "@sveltejs/kit";
import type { Document } from "langchain/document";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const COST_EMBEDDINGS_PER_TOKEN = 0.0000004;
const COST_PINECONE_PER_DAY = 0.111 * 24;

const REVENUE = 0.05;

export const POST: RequestHandler = async ({ request }) => {
  // get data
  const data = await request.formData();
  const file = data.get("pdf") as File;

  // 2. Split in chunks
  let chunks: Document<Record<string, any>>[];
  try {
    // splitting pdf into chunks
    const loader = new PDFLoader(file);
    const docs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 0,
    });
    chunks = await splitter.splitDocuments(docs);
    const estimatedTokenSum = chunks.length * 1000 * 1.33;
    console.log("estimated token sum: " + estimatedTokenSum);

    const estimatedCostEmbedding =
      Math.ceil(estimatedTokenSum * COST_EMBEDDINGS_PER_TOKEN * 100) / 100;

    const estimatedCostPinecone = Math.ceil(COST_PINECONE_PER_DAY * 100) / 100;

    const totalEstimatedCost = (
      estimatedCostEmbedding +
      estimatedCostPinecone +
      REVENUE
    ).toFixed(2);

    return new Response(totalEstimatedCost);
  } catch (e) {
    console.log(e);
    throw error(500, "Internal error occured");
  }
};
