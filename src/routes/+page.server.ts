import type { Actions } from './$types';
import { promises as fs } from 'fs';

export const actions: Actions = {
	upload: async ({ cookies, request }) => {
		const fileField = await request.formData().then((data) => {
			return data.get('pdf');
		});
		//const fileField = data.get('pdf'); // value of 'name' attribute of input
		if (!fileField || !(fileField instanceof File)) {
			return 'error';
		}
		const fileBuffer = await fileField.arrayBuffer();
		const filePath = `./docs/${fileField.name}`;
		await fs.writeFile(filePath, Buffer.from(fileBuffer));
		return {
			status: 200,
			body: 'PDF file uploaded successfully'
		};
	}
};
