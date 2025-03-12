import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Create Supabase client with better error handling
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or key in environment variables');
    // Return a mock client that logs errors instead of crashing
    return {
      rpc: () => Promise.resolve({ data: [], error: new Error('Supabase client not initialized') }),
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: new Error('Supabase client not initialized') }),
            maybeSingle: () => Promise.resolve({ data: null, error: new Error('Supabase client not initialized') }),
          }),
          order: () => ({}),
          limit: () => ({}),
        }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase client not initialized') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase client not initialized') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase client not initialized') }),
      }),
    };
  }
  
  try {
    // Validate URL format
    try {
      new URL(supabaseUrl);
    } catch (e) {
      console.error('Invalid Supabase URL format:', supabaseUrl);
      throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
    }
    
    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    throw error;
  }
};

const supabase = createSupabaseClient();

// Helper function to execute SQL queries
export async function query(
  q: string,
  values: (string | number)[] = []
): Promise<any> {
  try {
    // Replace placeholders (?) with $1, $2, etc. for Postgres
    let queryText = q;
    let paramIndex = 1;
    
    // Replace MySQL-style placeholders with PostgreSQL-style
    queryText = queryText.replace(/\?/g, () => `$${paramIndex++}`);
    
    // Execute the query using Supabase
    const { data, error } = await supabase.rpc('execute_sql', { 
      query_text: queryText,
      query_params: values
    });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default { query, supabase };
