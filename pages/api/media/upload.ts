import { NextApiRequest, NextApiResponse } from 'next';
import { uploadMediaToSupabase, ensureStorageBucketExists } from '../../../lib/supabaseStorage';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';

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
    // Ensure storage bucket exists
    await ensureStorageBucketExists();

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

    // Get the component ID
    const componentId = Array.isArray(fields.componentId) 
      ? fields.componentId[0] 
      : fields.componentId || 'default';

    // Get the file
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the file
    const fileData = await fs.readFile(file.filepath);

    // Upload to Supabase Storage
    const { url, path, mediaType, error } = await uploadMediaToSupabase(
      fileData, 
      componentId, 
      file.originalFilename || 'file',
      file.mimetype || 'application/octet-stream'
    );

    if (error) {
      console.error('Supabase storage upload error:', error);
      return res.status(500).json({ message: 'Failed to upload file to storage', error });
    }

    // Clean up the temporary file
    await fs.unlink(file.filepath);

    return res.status(200).json({
      message: 'File uploaded successfully',
      url,
      path,
      mediaType
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      message: 'Error uploading file',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
