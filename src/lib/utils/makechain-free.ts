import { PromptTemplate } from 'langchain';
import { OPENAI_API_KEY, HF_ACCESS_TOKEN } from '$env/static/private';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import type { PineconeStore } from 'langchain/vectorstores';
import { HuggingFaceInference } from 'langchain/llms/hf';
import type { BaseLanguageModel } from 'langchain/dist/base_language';
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BaseCallbackHandler } from "langchain/callbacks";

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
If you can't find the answer in the context below, just say "The document does not provide information to answer your question." Don't try to make up an answer.
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
	onTokenStream: (token: string) => void,
) => {

	const llmCb = BaseCallbackHandler.fromMethods({
		handleLLMNewToken(token: string) {
			console.log({ token });
			onTokenStream(token);
		},
		handleLLMStart(llm, _prompts: string[]) {
		  console.log("input tokens: ",  _prompts);
		},
		handleLLMEnd(output, runId, parentRunId?) {
			console.log("output tokens:  ", output.llmOutput);
		},
	});

	let model: BaseLanguageModel;
	if (modelProvider === ModelProvider.OPENAI) {
		model = new ChatOpenAI({
			temperature: 0,
			openAIApiKey: OPENAI_API_KEY,
			modelName: 'gpt-3.5-turbo',
			maxRetries: 3,
			streaming: true,
			
			/* callbacks: CallbackManager.fromHandlers({
				async handleLLMNewToken(token) {
					onTokenStream(token);
				},
			}), */
			callbacks: [llmCb]
		});
	} else {
		model = new HuggingFaceInference({
			model: 'gpt2',
			apiKey: HF_ACCESS_TOKEN,
			temperature: 1,
			maxRetries: 3,
		});
	}
	return ConversationalRetrievalQAChain.fromLLM(model, vectorstore.asRetriever(2), {
		returnSourceDocuments: true,
		//questionGeneratorTemplate: CONDENSE_PROMPT.template,
		//qaTemplate: QA_PROMPT.template,
	});
};
