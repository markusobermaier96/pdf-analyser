import { OPENAI_API_KEY } from '$env/static/private';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@lib/config/pinecone';
import { makeChain } from '@lib/utils/makechain';
import { pinecone } from '@lib/utils/pinecone-client';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import type { ChatCompletionRequestMessage } from 'openai';

export const POST = async ({ request }) => {
	const reqMessages: ChatCompletionRequestMessage[] = await request
		.json()
		.then((data) => {
			return data.messages;
		})
		.catch(() => {
			throw new Error('No request data');
		});

	const index = pinecone.Index(PINECONE_INDEX_NAME);

	/* create vectorstore*/
	const vectorStore = await PineconeStore.fromExistingIndex(
		new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
		{
			pineconeIndex: index,
			textKey: 'text',
			namespace: PINECONE_NAME_SPACE
		}
	);

	// create stream writer
	const writeStream = (data: any) => {
		const stream = new ReadableStream({
			start(controller) {
				controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
			}
		});
		return stream;
	};

	// create chain with stream writer
	const chain = makeChain(vectorStore, (token: string) => {
		const data = { data: token };
		console.log(data);
		return writeStream(data);
	});

	try {
		// Ask a question
		const response = await chain.call({
			question: reqMessages[reqMessages.length - 1].content,
			chat_history: reqMessages
		});

		// Send the response through an SSE stream
		const stream = writeStream(response);

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		});
	} catch (error) {
		console.error('error', error);
		return new Response(error.message, { status: 500 });
	} finally {
		console.log('done');
	}
};
