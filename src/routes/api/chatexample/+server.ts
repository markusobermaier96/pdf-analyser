import { error, type RequestHandler } from '@sveltejs/kit';
import type { Config } from '@sveltejs/adapter-vercel';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import type { ChatCompletionRequestMessage } from 'openai/dist/api';
import { pinecone } from '@lib/server/pinecone';
import { makeChain, ModelProvider } from '@lib/utils/makechain-free';
import { HuggingFaceInferenceEmbeddings } from 'langchain/embeddings/hf';
import { HF_ACCESS_TOKEN } from '$env/static/private';

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

	const pineconeIndex = pinecone.Index(indexHash);

	/* const vectorStore = await PineconeStore.fromExistingIndex(new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
		{
			pineconeIndex: index,
			textKey: 'text',
			namespace: PINECONE_NAME_SPACE
		}); */
	let vectorStore: PineconeStore
	try {
		vectorStore = await PineconeStore.fromExistingIndex(
		
			new HuggingFaceInferenceEmbeddings({ apiKey: HF_ACCESS_TOKEN }),
			{
				pineconeIndex: pineconeIndex,
				textKey: 'text',
			})
	} catch (err) {
		console.log(err)
		throw error(500, 'Error getting vector store')	
	}

	const stream = new ReadableStream({
		async start(controller) {
			/* let sentence = 'You, are, dumb, and, i, cant, help, you. '
			for (let i = 0; i < 3; i++) {
				let arr = sentence.split(',');
				for (let j = 0; j < arr.length; j++) {
					sendData(controller, arr[j]);
				}
			} */
			console.log("calling chain with: " + reqMessages[reqMessages.length - 1].content)
			const chain = makeChain(ModelProvider.HF, vectorStore, (token: string) => {
				sendData(controller, token);
			});
			await chain
				.call({
					question: reqMessages[reqMessages.length - 1].content,
					chat_history: reqMessages || []
				})
				.then((res) => {console.log(res);})
				.catch((err) => {
					console.log(err);
					throw error(500, 'Too many requests. Exceeded API limit');
				});

			sendData(controller, '[DONE]');
			console.log("done")
		}
	});

	setHeaders({
		'Cache-Control': 'no-cache',
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive'
	});

	return new Response(stream);
};
