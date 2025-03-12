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
    // Initialize Supabase client directly
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role key for SQL execution
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ message: 'Missing Supabase credentials' });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Step 1: Create the update_modified_column function
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = now();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `;
    
    await supabase.rpc('execute_sql', { query_text: createFunctionSQL });
    
    // Step 2: Create the categories table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await supabase.rpc('execute_sql', { query_text: createTableSQL });
    
    // Step 3: Create the trigger (wrapped in DO block to avoid errors if it already exists)
    const createTriggerSQL = `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger 
          WHERE tgname = 'update_categories_modtime'
        ) THEN
          CREATE TRIGGER update_categories_modtime
          BEFORE UPDATE ON categories
          FOR EACH ROW
          EXECUTE FUNCTION update_modified_column();
        END IF;
      END
      $$;
    `;
    
    await supabase.rpc('execute_sql', { query_text: createTriggerSQL });
    
    // Step 4: Create indices
    const createIndicesSQL = `
      CREATE INDEX IF NOT EXISTS idx_category_name ON categories(name);
      CREATE INDEX IF NOT EXISTS idx_category_slug ON categories(slug);
    `;
    
    await supabase.rpc('execute_sql', { query_text: createIndicesSQL });
    
    // Step 5: Insert categories from components
    const insertCategoriesSQL = `
      INSERT INTO categories (name, slug, description)
      SELECT DISTINCT 
        category, 
        LOWER(REPLACE(category, ' ', '-')) AS slug,
        category || ' components' AS description
      FROM components
      WHERE category IS NOT NULL AND category != ''
      ON CONFLICT (name) DO NOTHING;
    `;
    
    await supabase.rpc('execute_sql', { query_text: insertCategoriesSQL });
    
    // Step 6: Verify the table was created and has data
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
    
    if (categoriesError) {
      throw categoriesError;
    }
    
    return res.status(200).json({ 
      message: 'Categories table set up successfully',
      categories
    });
  } catch (error) {
    console.error('Error setting up categories table:', error);
    return res.status(500).json({ 
      message: 'Error setting up categories table',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
