import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { getResourceBySlug } from '../../../lib/resources';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if user is authenticated
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const { slug } = req.query;
  const includeContent = req.query.includeContent === 'true';
  
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug parameter' });
  }
  
  try {
    // Get the resource by slug
    const resource = getResourceBySlug(slug, includeContent);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    return res.status(200).json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 