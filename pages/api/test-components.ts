import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Log Supabase connection info
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');
    
    // Try a simple query first
    const { data: componentCount, error: countError } = await db.supabase
      .from('components')
      .select('*', { count: 'exact', head: true });
    
    console.log('Component count result:', componentCount);
    console.log('Component count error:', countError);
    
    // Get all components with minimal fields
    const { data: components, error } = await db.supabase
      .from('components')
      .select('id, title, category')
      .order('date', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Check if the components table exists
    const { data: tableInfo, error: tableError } = await db.supabase
      .rpc('execute_sql', {
        query_text: "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'components')"
      });
    
    // Try to get components directly with SQL
    const { data: sqlComponents, error: sqlError } = await db.supabase
      .rpc('execute_sql', {
        query_text: "SELECT id, title, category FROM components LIMIT 10"
      });
    
    return res.status(200).json({
      message: 'Components test',
      components,
      componentCount: components?.length || 0,
      tableExists: tableInfo,
      tableError: tableError ? tableError.message : null,
      sqlComponents,
      sqlError: sqlError ? sqlError.message : null
    });
  } catch (error) {
    console.error('Error testing components:', error);
    return res.status(500).json({ 
      message: 'Error testing components',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
