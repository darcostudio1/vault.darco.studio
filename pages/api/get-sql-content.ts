import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { file } = req.query;
    
    if (!file || typeof file !== 'string') {
      return res.status(400).json({ message: 'File parameter is required' });
    }
    
    // Validate filename to prevent directory traversal
    const filename = path.basename(file);
    const sqlFilePath = path.join(process.cwd(), 'lib', filename);
    
    // Check if file exists
    if (!fs.existsSync(sqlFilePath)) {
      return res.status(404).json({ message: 'SQL file not found' });
    }
    
    // Read file content
    const content = fs.readFileSync(sqlFilePath, 'utf8');
    
    return res.status(200).json({ content });
  } catch (error) {
    console.error('Error reading SQL file:', error);
    return res.status(500).json({ 
      message: 'Error reading SQL file',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
