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
    // Check if required tables exist
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('components', 'component_content', 'tags', 'component_tags')
    `;
    
    const tables = await db.query(query);
    
    // Get list of existing tables
    const existingTables = tables.map((row: any) => row.table_name);
    
    // Check which required tables are missing
    const requiredTables = ['components', 'component_content', 'tags', 'component_tags'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      return res.status(200).json({
        ready: false,
        message: 'Some required tables are missing',
        existingTables,
        missingTables
      });
    }
    
    return res.status(200).json({
      ready: true,
      message: 'All required tables exist',
      tables: existingTables
    });
  } catch (error) {
    console.error('Error checking database tables:', error);
    return res.status(500).json({
      ready: false,
      message: 'Failed to check database setup',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
