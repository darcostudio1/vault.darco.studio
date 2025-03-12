import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Test connection using a simple query
    const result = await db.query('SELECT 1 as connected');
    
    return res.status(200).json({
      connected: true,
      message: 'Successfully connected to the Supabase database'
    });
  } catch (error) {
    console.error('Error checking database connection:', error);
    return res.status(500).json({
      connected: false,
      message: 'Failed to connect to the Supabase database',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
