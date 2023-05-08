import { error, type RequestHandler } from "@sveltejs/kit";
import type { Document } from "langchain/document";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


export const POST: RequestHandler = async ({ request }) => {
	// get data
	const data = await request.formData();
	const file = data.get('pdf') as File;
	
	// 2. Split in chunks
	let chunks: Document<Record<string, any>>[];
	try {
		// splitting pdf into chunks
		const loader = new PDFLoader(file);
		const docs = await loader.load();
		const splitter = new RecursiveCharacterTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 0
		});
		chunks = await splitter.splitDocuments(docs);
		let tokenSum = chunks.length * 1000 / 4
		let estimatedCost = tokenSum / 1000 * 0.0004
		console.log("chunks: " + chunks.length)
		console.log("sum of characters: " + chunks.length * 1000)
		console.log("tokenSum: " + tokenSum)
		console.log("estimatedCost: " + estimatedCost)
		return new Response(JSON.stringify(estimatedCost.toString()));
	}
	catch(e) {
		console.log(e)
		throw error(500, "Internal error occured")
	}	
}
