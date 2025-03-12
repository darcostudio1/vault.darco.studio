import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get SQL query from request body
    const { sql } = req.body;
    
    if (!sql) {
      return res.status(400).json({ message: 'SQL query is required' });
    }
    
    // Initialize Supabase client directly
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role key for SQL execution
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ message: 'Missing Supabase credentials' });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Execute SQL query
    const { data, error } = await supabase.rpc('execute_sql', {
      query_text: sql
    });
    
    if (error) {
      throw error;
    }
    
    return res.status(200).json({ 
      message: 'SQL executed successfully',
      result: data
    });
  } catch (error) {
    console.error('Error executing SQL:', error);
    return res.status(500).json({ 
      message: 'Error executing SQL',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
