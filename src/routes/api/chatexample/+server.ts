import { error, type RequestHandler } from '@sveltejs/kit';
import type { Config } from '@sveltejs/adapter-vercel';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import type { ChatCompletionRequestMessage } from 'openai/dist/api';
import { pinecone } from '@lib/server/pinecone';
import { makeChain, ModelProvider } from '@lib/utils/makechain-free';

export const config: Config = {
	runtime: 'edge'
};

export const POST: RequestHandler = async ({ request, setHeaders }) => {
	const data = await request.json();
	const reqMessages: ChatCompletionRequestMessage[] = data.messages;
	const indexHash: string = data.indexHash;

	async function sendData(controller: ReadableStreamDefaultController, data: string) {
		controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
	}

	//let sentence = 'You, are, dumb, and, i, cant, help, you. ';

	const pineconeIndex = pinecone.Index(indexHash);
	const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings(), {
		pineconeIndex
	});

	const stream = new ReadableStream({
		async start(controller) {
			/* for (let i = 0; i < 3; i++) {
				let arr = sentence.split(',');
				for (let j = 0; j < arr.length; j++) {
					await sleep(70, 300);
					sendData(controller, arr[j]);
				}
			} */
			const chain = makeChain(ModelProvider.OPENAI, vectorStore, (token: string) => {
				sendData(controller, token);
			});

			await chain
				.call({
					question: reqMessages[reqMessages.length - 1].content,
					chat_history: reqMessages || []
				})
				.catch((err) => {
					console.log(err);
					throw error(500, 'Too many requests. Exceeded API limit');
				});

			sendData(controller, '[DONE]');
		}
	});

	setHeaders({
		'Cache-Control': 'no-cache',
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive'
	});

	return new Response(stream);
};
