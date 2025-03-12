import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getAllResources } from '../../../lib/resources';

export default async function handler(req: NextApiRequest, NextApiResponse) {
  // Check if user is authenticated
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Get query parameters
  const { 
    includeContent = 'false',
    limit = '0',
    sortBy = 'updatedAt',
    sortOrder = 'desc',
    tags,
    category,
    search
  } = req.query;
  
  try {
    // Get all resources
    let resources = getAllResources({
      includeContent: includeContent === 'true',
      limit: parseInt(limit as string) || 0,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any
    });
    
    // Filter by tags if provided
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : [tags];
      resources = resources.filter(resource => 
        resource.tags.some(tag => tagList.includes(tag))
      );
    }
    
    // Filter by category if provided
    if (category) {
      resources = resources.filter(resource => 
        resource.category === category
      );
    }
    
    // Filter by search term if provided
    if (search && typeof search === 'string') {
      const searchTerm = search.toLowerCase();
      resources = resources.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.description.toLowerCase().includes(searchTerm) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    return res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 