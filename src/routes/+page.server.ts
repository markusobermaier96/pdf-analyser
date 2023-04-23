import type { Actions, PageServerLoad } from './$types';
import { promises as fs } from 'fs';
import { error } from '@sveltejs/kit';

export const actions: Actions = {
	upload: async ({ request }) => {
		const fileField = await request.formData().then((data) => {
			return data.get('pdf');
		});
		//const fileField = data.get('pdf'); // value of 'name' attribute of input
		if (!fileField || !(fileField instanceof File)) {
			throw error(400, {
				message: 'Couldnt upload file: No proper format.'
			});
		}
		const fileBuffer = await fileField.arrayBuffer();
		const filePath = `./docs/${fileField.name}`;

		await fs
			.writeFile(filePath, Buffer.from(fileBuffer))
			.then(() => {
				return {
					status: 200,
					body: 'PDF file uploaded successfully'
				};
			})
			.catch(() => {
				throw error(500, {
					message: 'Couldnt upload file: Internal server error occured'
				});
			});
	}
};
