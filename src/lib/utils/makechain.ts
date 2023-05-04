import { OpenAIChat } from 'langchain/llms';
import { LLMChain, ConversationalRetrievalQAChain, loadQAChain } from 'langchain/chains';
import type { PineconeStore } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from 'langchain/callbacks';
import { OPENAI_API_KEY } from '$env/static/private';

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

export const makeChain = (vectorstore: PineconeStore, onTokenStream?: (token: string) => void) => {
	const questionGenerator = new LLMChain({
		llm: new OpenAIChat({ openAIApiKey: OPENAI_API_KEY, temperature: 0 }),
		prompt: CONDENSE_PROMPT
	});
	const docChain = loadQAChain(
		new OpenAIChat({
			openAIApiKey: OPENAI_API_KEY,
			temperature: 0,
			modelName: 'gpt-3.5-turbo', //change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
			streaming: Boolean(onTokenStream),
			callbackManager: onTokenStream
				? CallbackManager.fromHandlers({
						async handleLLMNewToken(token) {
							onTokenStream(token);
							//console.log(token);
						}
				  })
				: undefined
		}),
		{ prompt: QA_PROMPT }
	);

	return new ConversationalRetrievalQAChain({
		vectorstore,
		combineDocumentsChain: docChain,
		questionGeneratorChain: questionGenerator,
		returnSourceDocuments: true,
		k: 2 //number of source documents to return
	});
};
