import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getAllTags, getAllCategories } from '../../../lib/resources';

export default async function handler(req: NextApiRequest, NextApiResponse) {
  // Check if user is authenticated
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Get all tags and categories
    const tags = getAllTags();
    const categories = getAllCategories();
    
    return res.status(200).json({
      tags,
      categories
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 