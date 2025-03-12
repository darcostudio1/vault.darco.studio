import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import db from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), 'lib', 'categories-schema.sql');
    const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL query
    const { data, error } = await db.supabase.rpc('execute_sql', {
      query_text: sqlQuery
    });

    if (error) {
      throw error;
    }

    // Fetch all unique categories from components
    const { data: components, error: componentsError } = await db.supabase
      .from('components')
      .select('category')
      .not('category', 'is', null);

    if (componentsError) {
      throw componentsError;
    }

    // Extract unique categories
    const uniqueCategories = Array.from(
      new Set(components?.map(comp => comp.category).filter(Boolean))
    );

    // Insert categories into the new table
    for (const category of uniqueCategories) {
      // Check if category already exists
      const { data: existingCategory, error: checkError } = await db.supabase
        .from('categories')
        .select('*')
        .eq('name', category)
        .maybeSingle();
        
      if (checkError) {
        console.error(`Error checking if category ${category} exists:`, checkError);
        continue;
      }
      
      if (existingCategory) {
        console.log(`Category ${category} already exists, skipping...`);
        continue;
      }
      
      // Insert new category
      const { error: insertError } = await db.supabase
        .from('categories')
        .insert({
          name: category,
          slug: category.toLowerCase().replace(/\s+/g, '-'),
          description: `${category} components`
        });

      if (insertError) {
        console.error(`Error inserting category ${category}:`, insertError);
      }
    }

    return res.status(200).json({ 
      message: 'Categories table set up successfully',
      categories: uniqueCategories
    });
  } catch (error) {
    console.error('Error setting up categories table:', error);
    return res.status(500).json({ 
      message: 'Error setting up categories table',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
