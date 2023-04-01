import type { Actions } from './$types';

export const actions: Actions = {
	upload: async ({ cookies, request }) => {
		const data = await request.formData();
		const file = data.get('pdf');
		const filePath = `docs/${file.name}`;
		const writeStream = fs.createWriteStream(filePath);
	
		await new Promise((resolve, reject) => {
		  // Pipe the file data to the write stream
		  file.pipe(writeStream);
	
		  // Handle any errors that may occur while writing the file
		  writeStream.on('error', reject);
	
		  // Handle the successful write of the file
		  writeStream.on('finish', resolve);
		});
	
		return "File uploaded successfully";
	  }
} satisfies Actions;
