import * as fs from 'fs';

export const actions: Actions = {
  upload: async ({ cookies, request }) => {
    const data = await request.formData();
    const file = data.get('pdf');
    if (!file) {
      throw new Error('no file available');
    }
  
    const fileName = file.name;
    const fileContent = file instanceof Blob ? file : file.buffer;
    console.log("file name ", fileName)
    console.log("file content ", fileContent)
    const fileObject = new File([fileContent], fileName);

    // Create the directory if it doesn't exist
    await fs.promises.mkdir('docs', { recursive: true });
    const filePath = `docs/${file.name}`;
    const writeStream = fs.createWriteStream(filePath);

    await new Promise<void>((resolve, reject) => {
      readStream.pipe(writeStream);

      readStream.on('error', reject);

      writeStream.on('error', reject);

      writeStream.on('finish', resolve);
    });

    return 'File uploaded successfully';
  },
};
