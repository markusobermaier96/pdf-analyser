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
import type { Document } from "langchain/document";

/* 
How it works:

1. Extract content 

2. Split in chunks

3. Create embeddings from chunks

4. Store embeddings in pinecone

5. Store hash in db and link document to user

*/


const MAX_HASH_LENGTH = 45;

export const actions: Actions = {
	upload: async ({ request, cookies }) => {
		// 1. Extract content
		const data = await request.formData();
		const publicAddress = data.get('publicAddress') as string;
		const fileField = data.get('pdf') as File;

		if (!fileField || !(fileField instanceof File)) {
			throw error(500, {
				message: 'Couldnt upload file: No proper format.'
			});
		}

		// 2. Split in chunks
		let chunks: Document<Record<string, any>>[];
		try {
			// splitting pdf into chunks
			const loader = new PDFLoader(fileField);
			const docs = await loader.load();
			const splitter = new RecursiveCharacterTextSplitter({
				chunkSize: 1000,
				chunkOverlap: 0
			});
			chunks = await splitter.splitDocuments(docs);
		} catch (err) {
			throw error(500, {
				message: 'Processing of pdf file failed'
			});
		}

		/* // 3. Create Embeddings from chunks
		const embeddings = new HuggingFaceInferenceEmbeddings({
			apiKey: HF_ACCESS_TOKEN,
		});
		const documents = chunks.map(chunk => chunk.pageContent);
		const documentRes = await embeddings.embedDocuments(documents);
		console.log(documentRes) */

		let hash: string;
		try {
			// Read the file contents as a Buffer
			const buffer = await fileField.arrayBuffer();

			// Generate the SHA-256 hash value of the uploaded file
			hash = await generateHashMaxLength(Buffer.from(buffer), MAX_HASH_LENGTH);

			// 4. Store embeddings in pinecone
			if (!(await pinecone.listIndexes()).includes(hash)) {
				await pinecone.createIndex({
					createRequest: {
						name: hash,
						dimension: 768
					}
				})
				.catch(err => {
					console.log("couldnt create index")
					throw error(500, "Upload failed")
				});
				// wait for index to be created
				let indexCreated = false
				while (!indexCreated) {
					console.log(await pinecone.describeIndex({indexName: hash}))
					if((await pinecone.describeIndex({indexName: hash})).status?.ready) {
						indexCreated = true
					}
				}
				// write vectors to pinecone index
				const pineconeIndex = pinecone.Index(hash);
				/* await PineconeStore.fromDocuments(chunks, new OpenAIEmbeddings(), {
					pineconeIndex
				}); */
				await PineconeStore.fromDocuments(
					chunks,
					new HuggingFaceInferenceEmbeddings({
						apiKey: HF_ACCESS_TOKEN
					}),
					{
						pineconeIndex
					}
				).catch(err => {
					console.log("couldnt upload vectors")
					pinecone.deleteIndex({indexName: hash})
					throw error(500, "Upload failed")
				});
			} else {
				console.log('Pinecone: Index already exists');
				// TODO: delete index if its empty
				/* if((await pinecone.describeIndex({indexName: hash})).database?. == "ready") {
					indexCreated = true
				} */
			}

			// 5. Store hash in db and link document to user
			if (!(await prisma.file.findUnique({ where: { hash } }))) {
				let file_model = {
					hash: hash,
					name: fileField.name,
					size: fileField.size,
					user: { connect: { publicAddress: publicAddress } }
				};
				await prisma.file
					.create({
						data: file_model
					})
					.then(() => {
						console.log('stored file in db');
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				console.log('Prisma: File already in store');
			}
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
