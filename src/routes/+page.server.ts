import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from "@lib/config/pinecone";
import type { Actions } from "@sveltejs/kit";
import { pinecone } from '@lib/utils/pinecone-client';
import { PineconeStore } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings';

export const actions: Actions = {
    default: async ({request }) => {
        const { question, history } = Object.fromEntries(await request.formData())
        // OpenAI recommends replacing newlines with spaces for best results
        const sanitizedQuestion = question.valueOf().toString().trim().replaceAll('\n', ' ');
        const index = pinecone.Index(PINECONE_INDEX_NAME);

        /* create vectorstore*/
        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({}),
            {
            pineconeIndex: index,
            textKey: 'text',
            namespace: PINECONE_NAME_SPACE,
            },
        );
        

    }
};