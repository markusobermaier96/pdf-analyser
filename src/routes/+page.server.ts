import type { Actions } from './$types';
import { error } from '@sveltejs/kit';
import { generateHash } from '@lib/utils/genereateHash';
import { prisma } from '@lib/server/prisma';

export const actions: Actions = {
	upload: async ({ request }) => {
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
		const hash = await generateHash(Buffer.from(buffer));

		// Check if a PdfFile with the same hash already exists
		const existingFile = await prisma.file.findUnique({ where: { hash } });
		if (existingFile) {
			console.log(`PdfFile with hash ${hash} already exists`);
			return;
		}

		// Create a new PdfFile object and save it to the database
		await prisma.file.create({
			data: {
				hash,
				name: fileField.name,
				size: fileField.size,
				data: Buffer.from(buffer),
				user: { connect: { publicAddress: publicAddress } }
			}
		});

		console.log(`Saved PdfFile with hash ${hash}`);
	}
};
