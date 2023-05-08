import { OPENAI_API_KEY } from '$env/static/private';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@lib/config/pinecone';
import { pinecone } from '@lib/server/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import type { ChatCompletionRequestMessage } from 'openai';
import { makeChain, ModelProvider } from '@lib/utils/makechain-free';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, setHeaders }) => {
	const data = await request.json();
	const reqMessages: ChatCompletionRequestMessage[] = data.messages;
	const indexHash: string = data.indexHash;

	const index = pinecone.Index(indexHash);

	/* get vectorstore*/
	const vectorStore = await PineconeStore.fromExistingIndex(
		new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
		{
			pineconeIndex: index,
			textKey: 'text',
			namespace: PINECONE_NAME_SPACE
		}
	);

	async function sendData(controller: ReadableStreamDefaultController, data: string) {
		controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
	}

	// Create a controller
	const controller = new ReadableStreamDefaultController();

	// Create a chain
	const chain = makeChain(ModelProvider.OPENAI,vectorStore, (token: string) => {
		sendData(controller, token);
	});

	// Start streaming
	const stream = new ReadableStream({
		async start(controller) {
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
