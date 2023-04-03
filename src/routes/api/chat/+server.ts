import { OPENAI_API_KEY } from '$env/static/private';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@lib/config/pinecone';
import { pinecone } from '@lib/utils/pinecone-client';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import type { ChatCompletionRequestMessage } from 'openai';
import { makeChain } from '@lib/utils/makechain-free';

export const POST = async ({ request }) => {
	const reqMessages: ChatCompletionRequestMessage[] = await request
		.json()
		.then((data) => {
			return data.messages;
		})
		.catch(() => {
			throw new Error('No request data');
		});
        console.log("step 1: get user input")
        console.log(reqMessages)

	const index = pinecone.Index(PINECONE_INDEX_NAME);
    console.log("step 2: get Pineconde index")
    console.log(index)

	/* create vectorstore*/
	const vectorStore = await PineconeStore.fromExistingIndex(
		new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY }),
		{
			pineconeIndex: index,
			textKey: 'text',
			namespace: PINECONE_NAME_SPACE
		}
	);
    console.log("step 3: get vectorstore")
    console.log(vectorStore)

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
		return writeStream(data);
	});
    console.log("step 4: make chain")
    console.log(chain)

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
		return new Response(error.message, { status: 500 });
	} finally {
		console.log('done');
	}
};
