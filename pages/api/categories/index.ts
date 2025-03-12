import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

// Define interfaces for better type safety
interface Category {
  id?: number;
  name: string;
  slug: string;
  description: string;
}

interface Component {
  category: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return getCategories(req, res);
    case 'POST':
      return addCategory(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get all categories
async function getCategories(req: NextApiRequest, res: NextApiResponse) {
  try {
    // First, get all categories from the categories table
    const { data: categoriesData, error: categoriesError } = await db.supabase
      .from('categories')
      .select('*')
      .order('name') as PostgrestSingleResponse<Category[]>;
    
    if (categoriesError) throw categoriesError;
    
    // If no categories exist yet, get unique categories from components
    if (!categoriesData || categoriesData.length === 0) {
      const { data: components, error: componentsError } = await db.supabase
        .from('components')
        .select('category') as PostgrestSingleResponse<Component[]>;
      
      if (componentsError) throw componentsError;
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(components?.map((comp: Component) => comp.category).filter(Boolean))
      ).sort();
      
      // Create category objects
      const categoryObjects = uniqueCategories.map((category: string) => ({
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, '-'),
        description: `${category} components`
      }));
      
      return res.status(200).json(categoryObjects);
    }
    
    return res.status(200).json(categoriesData);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ 
      message: 'Error fetching categories',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// Add a new category
async function addCategory(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, description = '' } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
    
    // Check if category already exists
    const { data: existingCategory, error: checkError } = await db.supabase
      .from('categories')
      .select('*')
      .eq('name', name)
      .maybeSingle() as PostgrestSingleResponse<Category | null>;
    
    if (checkError) throw checkError;
    
    if (existingCategory) {
      return res.status(200).json({ 
        message: 'Category already exists',
        category: existingCategory
      });
    }
    
    // Create slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    // Create the new category object
    const newCategory: Category = {
      name,
      slug,
      description: description || `${name} components`
    };
    
    // First, insert the new category
    const insertResult = await db.supabase
      .from('categories')
      .insert(newCategory);
      
    if (insertResult.error) throw insertResult.error;
    
    // Then fetch the newly created category
    const { data, error } = await db.supabase
      .from('categories')
      .select('*')
      .eq('name', name)
      .single() as PostgrestSingleResponse<Category>;
    
    if (error) throw error;
    
    return res.status(201).json({
      message: 'Category created successfully',
      category: data
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ 
      message: 'Error creating category',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
