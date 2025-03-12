import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import db from '../../../lib/db';
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

    // Get the component ID and folder from the form fields
    const componentId = fields.componentId?.[0] || uuidv4();
    const folder = fields.folder?.[0] || 'images';

    // Get the file
    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the file
    const fileData = await fs.readFile(file.filepath);

    // Determine file extension and generate a unique filename
    const fileExt = file.originalFilename?.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${folder}/${componentId}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await db.supabase.storage
      .from('component-media')
      .upload(filePath, fileData, {
        contentType: file.mimetype || 'application/octet-stream',
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return res.status(500).json({ message: 'Failed to upload file to storage', error });
    }

    // Get the public URL
    const { data: urlData } = db.supabase.storage
      .from('component-media')
      .getPublicUrl(filePath);

    // Clean up the temporary file
    await fs.unlink(file.filepath);

    return res.status(200).json({
      message: 'File uploaded successfully',
      url: urlData.publicUrl,
      path: filePath,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      message: 'Error uploading file',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
