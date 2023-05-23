import { error, type RequestHandler } from "@sveltejs/kit";
import type { Config } from "@sveltejs/adapter-vercel";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import type { ChatCompletionRequestMessage } from "openai/dist/api";
import { pinecone } from "@lib/server/pinecone";
import { makeChain, ModelProvider } from "@lib/utils/makechain-free";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import { HF_ACCESS_TOKEN, OPENAI_API_KEY } from "$env/static/private";
import { ConsoleCallbackHandler } from "langchain/callbacks";

/* export const config: Config = {
	runtime: 'edge'
}; */

export const POST: RequestHandler = async ({ request, setHeaders }) => {
  const data = await request.json();
  const reqMessages: ChatCompletionRequestMessage[] = data.messages;
  const indexHash: string = data.indexHash;

  async function sendData(
    controller: ReadableStreamDefaultController,
    data: string
  ) {
    controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
  }

  const pineconeIndex = pinecone.Index(indexHash);

  let vectorStore: PineconeStore;
  try {
    vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
      {
        pineconeIndex: pineconeIndex,
      }
    );
  } catch (err) {
    console.log(err);
    throw error(500, "Error getting vector store");
  }

  const stream = new ReadableStream({
    async start(controller) {
      let sendAnswer = false;
      let emptyTokenCount = 0;
      const chain = makeChain(
        ModelProvider.OPENAI,
        vectorStore,
        (token: string) => {
          if (token == "") {
            emptyTokenCount++;
          } else {
            emptyTokenCount = 0;
          }
          if (emptyTokenCount == 2) {
            sendAnswer = true;
          }
          if (sendAnswer) {
            sendData(controller, token);
          }
        }
      );
      await chain
        .call({
          question: reqMessages[reqMessages.length - 1].content,
          chat_history: reqMessages || [],
        })
        .catch((err) => {
          throw error(500, "Too many requests. Exceeded API limit");
        });

      sendData(controller, "[DONE]");
      console.log("done");
    },
  });

  setHeaders({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });

  return new Response(stream);
};
