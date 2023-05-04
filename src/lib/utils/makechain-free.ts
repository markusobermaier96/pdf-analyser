import { PromptTemplate } from 'langchain';
import { OPENAI_API_KEY, HF_ACCESS_TOKEN } from '$env/static/private';
import { CallbackManager } from 'langchain/callbacks';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import type { PineconeStore } from 'langchain/vectorstores';
import { HuggingFaceInference } from 'langchain/llms/hf';
import type { BaseLanguageModel } from 'langchain/dist/base_language';
import { ConversationalRetrievalQAChain } from 'langchain/dist/chains/conversational_retrieval_chain';

/* Question answering over documents consists of four steps:

1. Create an index

2. Create a Retriever from that index

3. Create a question answering chain

4. Ask questions!
*/

export enum ModelProvider {
	OPENAI,
	HF
}

const CONDENSE_PROMPT =
	PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
	`You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided.
You should only provide hyperlinks that reference the context below. Do NOT make up hyperlinks.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

Question: {question}
=========
{context}
=========
Answer in Markdown:`
);

export const makeChain = (
	modelProvider: ModelProvider,
	vectorstore: PineconeStore,
	onTokenStream: (token: string) => void
) => {
	let model: BaseLanguageModel;
	if (modelProvider === ModelProvider.OPENAI) {
		model = new ChatOpenAI({
			temperature: 0,
			openAIApiKey: OPENAI_API_KEY,
			modelName: 'gpt-3.5-turbo',
			maxRetries: 3,
			streaming: true
		});
	} else {
		model = new HuggingFaceInference({
			model: 'gpt2',
			apiKey: HF_ACCESS_TOKEN,
			temperature: 0
		});
	}

	return ConversationalRetrievalQAChain.fromLLM(model, vectorstore.asRetriever(), {
		returnSourceDocuments: true,
		callbacks: CallbackManager.fromHandlers({
			async handleLLMNewToken(token) {
				onTokenStream(token);
				console.log(token);
			}
		}),
		questionGeneratorTemplate: CONDENSE_PROMPT.template,
		qaTemplate: QA_PROMPT.template
	});
};

/* export const makeChain = (vectorstore, onTokenStream?: (token: string) => void) => {
	const questionGenerator = new LLMChain({
		llm: new HuggingFaceInference({ temperature: 1, model: 'gpt2' }),
		prompt: CONDENSE_PROMPT
	});
	const docChain = loadQAChain(
		new HuggingFaceInference({
			temperature: 1,
			model: 'gpt2', //change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
			callbackManager: onTokenStream
				? CallbackManager.fromHandlers({
						async handleLLMNewToken(token) {
							onTokenStream(token);
							console.log(token);
						}
				  })
				: undefined
		}),
		{ prompt: QA_PROMPT }
	);
	return new ChatVectorDBQAChain({
		vectorstore,
		combineDocumentsChain: docChain,
		questionGeneratorChain: questionGenerator,
		returnSourceDocuments: true,
		k: 2 //number of source documents to return
	});
};
 */
