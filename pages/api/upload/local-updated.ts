import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import { saveFileToLocal, ensureDirectoriesExist } from '../../../lib/serverFileStorage';
import { v4 as uuidv4 } from 'uuid';

// Disable the default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ensure upload directories exist
    await ensureDirectoriesExist();

    // Parse the multipart form data
    const form = new IncomingForm({
      keepExtensions: true,
      multiples: false,
    });

    // Parse the form
    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    // Get the component ID from the form fields
    const componentId = fields.componentId?.[0] || uuidv4();

    // Get the file
    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the file
    const fileData = await fs.readFile(file.filepath);

    // Save file to local storage
    const result = await saveFileToLocal(
      fileData,
      componentId,
      file.originalFilename || 'file.jpg',
      file.mimetype || 'application/octet-stream'
    );

    if (result.error) {
      console.error('Local storage upload error:', result.error);
      return res.status(500).json({ message: 'Failed to upload file to local storage', error: result.error });
    }

    // Clean up the temporary file
    await fs.unlink(file.filepath);

    return res.status(200).json({
      message: 'File uploaded successfully',
      url: result.url,
      path: result.path,
      mediaType: result.mediaType
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      message: 'Error uploading file',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
