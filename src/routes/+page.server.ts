import { generateHashMaxLength } from '@lib/utils/genereateHash';
import { prisma } from '@lib/server/prisma';
import { pinecone } from '@lib/utils/pinecone-client';
import { error, type Actions } from '@sveltejs/kit';

const MAX_HASH_LENGTH = 45;

export const actions: Actions = {
	upload: async ({ request, cookies }) => {
		const data = await request.formData();
		const publicAddress = data.get('publicAddress') as string;
		const fileField = data.get('pdf') as File;

		if (!fileField || !(fileField instanceof File)) {
			throw error(400, {
				message: 'Couldnt upload file: No proper format.'
			});
		}

		// Read the file contents as a Buffer
		const buffer = await fileField.arrayBuffer();

		// Generate the SHA-256 hash value of the uploaded file
		const hash = await generateHashMaxLength(Buffer.from(buffer), MAX_HASH_LENGTH);

		// Check if a PdfFile with the same hash already exists
		try {
			const existingFile = await prisma.file.findUnique({ where: { hash } });
			if (!existingFile) {
				await pinecone.createIndex({
					createRequest: {
						name: hash,
						dimension: 1536
					}
				});
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
			if (!cookies.get('hash')) {
				cookies.set('hash', hash);
			}
			return { hash };
		} catch (err) {
			throw error(500, 'Failed to reach db');
		}
	}
};
