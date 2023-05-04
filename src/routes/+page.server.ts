import { generateHashMaxLength } from '@lib/utils/genereateHash';
import { prisma } from '@lib/server/prisma';
import { pinecone } from '@lib/server/pinecone';
import { error, type Actions } from '@sveltejs/kit';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { HuggingFaceInferenceEmbeddings } from 'langchain/embeddings/hf';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { HF_ACCESS_TOKEN } from '$env/static/private';

const MAX_HASH_LENGTH = 45;

export const actions: Actions = {
	upload: async ({ request, cookies }) => {
		const data = await request.formData();
		const publicAddress = data.get('publicAddress') as string;
		const fileField = data.get('pdf') as File;

		if (!fileField || !(fileField instanceof File)) {
			throw error(500, {
				message: 'Couldnt upload file: No proper format.'
			});
		}

		// processing the pdf file
		let chunks;
		try {
			// splitting pdf into chunks
			const loader = new PDFLoader(fileField);
			const docs = await loader.load();
			const splitter = new RecursiveCharacterTextSplitter({
				chunkSize: 500,
				chunkOverlap: 100
			});
			chunks = await splitter.splitDocuments(docs);
		} catch (err) {
			throw error(500, {
				message: 'Processing of pdf file failed'
			});
		}

		// writing to db's
		let hash;
		try {
			// Read the file contents as a Buffer
			const buffer = await fileField.arrayBuffer();

			// Generate the SHA-256 hash value of the uploaded file
			hash = await generateHashMaxLength(Buffer.from(buffer), MAX_HASH_LENGTH);

			// Check if index already exists (only create index if not)
			if (!(await pinecone.listIndexes()).includes(hash)) {
				await pinecone.createIndex({
					createRequest: {
						name: hash,
						dimension: 768
					}
				});
			} else {
				console.log('index already exists');
			}

			if (!(await prisma.file.findFirst({ where: { hash } }))) {
				await prisma.file.create({
					data: {
						hash,
						name: fileField.name,
						size: fileField.size,
						data: Buffer.from(buffer),
						user: { connect: { publicAddress: publicAddress } }
					}
				});
			}

			// write vectors to pinecone index
			const pineconeIndex = pinecone.Index(hash);
			/* await PineconeStore.fromDocuments(chunks, new OpenAIEmbeddings(), {
				pineconeIndex,
			}); */
			await PineconeStore.fromDocuments(
				chunks,
				new HuggingFaceInferenceEmbeddings({
					apiKey: HF_ACCESS_TOKEN
				}),
				{
					pineconeIndex
				}
			);
		} catch (err) {
			console.log(err);
			throw error(500, 'Internal Server Error');
		}

		if (!cookies.get('hash')) {
			cookies.set('hash', hash);
		}
		return { hash };
	}
};
