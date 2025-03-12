import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Log the Supabase URL and key (partial for security)
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
    
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');
    
    // Check if categories table exists
    const { data: tableInfo, error: tableError } = await db.supabase
      .rpc('execute_sql', {
        query_text: "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'categories')"
      });
    
    console.log('Table check result:', tableInfo);
    console.log('Table check error:', tableError);
    
    // Try to get categories directly
    const { data: categoriesData, error: categoriesError } = await db.supabase
      .from('categories')
      .select('*');
    
    console.log('Categories data:', categoriesData);
    console.log('Categories error:', categoriesError);
    
    // If no categories exist, try to get unique categories from components
    if (!categoriesData || categoriesData.length === 0) {
      const { data: components, error: componentsError } = await db.supabase
        .from('components')
        .select('category');
      
      console.log('Components data:', components);
      console.log('Components error:', componentsError);
      
      if (componentsError) throw componentsError;
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(components?.map(comp => comp.category).filter(Boolean))
      ).sort();
      
      console.log('Unique categories from components:', uniqueCategories);
      
      return res.status(200).json({
        message: 'Categories from components',
        categories: uniqueCategories,
        categoriesData,
        categoriesError: categoriesError ? categoriesError.message : null,
        components,
        componentsError: componentsError ? componentsError.message : null,
        tableInfo,
        tableError: tableError ? tableError.message : null
      });
    }
    
    return res.status(200).json({
      message: 'Categories from categories table',
      categories: categoriesData,
      error: categoriesError ? categoriesError.message : null,
      tableInfo,
      tableError: tableError ? tableError.message : null
    });
  } catch (error) {
    console.error('Error in test-categories:', error);
    return res.status(500).json({ 
      message: 'Error testing categories',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
