import { PINECONE_INDEX_NAME } from "$env/static/private";

if (!PINECONE_INDEX_NAME) {
  throw new Error('Missing Pinecone index name in .env file');
}

const PINECONE_NAME_SPACE = 'pdf-test'; //namespace is optional for your vectors

export { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE };
