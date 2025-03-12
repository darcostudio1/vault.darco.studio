import fs from 'fs';
import path from 'path';

// Define the Resource interface (matching the one used in pages)
export interface Resource {
  id: string;
  title: string;
  description: string;
  tags: string[];
  slug: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  image?: string;
  notes?: string;
  content?: {
    html: string;
    css: string;
    js: string;
  };
}

/**
 * Get all resources from the content/resources directory
 * @param includeContent Whether to include the full content (HTML, CSS, JS) in the returned resources
 * @param limit Maximum number of resources to return (0 for all)
 * @param sortBy Field to sort by ('updatedAt' or 'createdAt')
 * @param sortOrder Sort order ('asc' or 'desc')
 * @returns Array of resources sorted by the specified field
 */
export function getAllResources({
  includeContent = false,
  limit = 0,
  sortBy = 'updatedAt',
  sortOrder = 'desc'
}: {
  includeContent?: boolean;
  limit?: number;
  sortBy?: 'updatedAt' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
} = {}): Resource[] {
  try {
    // Get the resources directory path
    const resourcesDirectory = path.join(process.cwd(), 'content/resources');
    
    // Check if directory exists
    if (!fs.existsSync(resourcesDirectory)) {
      console.warn('Resources directory not found:', resourcesDirectory);
      return [];
    }
    
    // Get all JSON files in the directory
    const filenames = fs.readdirSync(resourcesDirectory);
    const jsonFiles = filenames.filter(filename => filename.endsWith('.json'));
    
    // Read and parse each JSON file
    const resources = jsonFiles.map(filename => {
      const filePath = path.join(resourcesDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const resource = JSON.parse(fileContents) as Resource;
      
      // Ensure the slug matches the filename (without .json extension)
      resource.slug = filename.replace(/\.json$/, '');
      
      // Remove content if not requested
      if (!includeContent && resource.content) {
        const { content, ...resourceWithoutContent } = resource;
        return resourceWithoutContent;
      }
      
      return resource;
    });
    
    // Sort resources by the specified field
    const sortedResources = resources.sort((a, b) => {
      if (sortBy === 'title') {
        // Sort alphabetically for title
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else {
        // Sort by date for updatedAt or createdAt
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
    
    // Apply limit if specified
    return limit > 0 ? sortedResources.slice(0, limit) : sortedResources;
  } catch (error) {
    console.error('Error loading resources:', error);
    return [];
  }
}

/**
 * Get a single resource by slug
 * @param slug The resource slug
 * @param includeContent Whether to include the full content (HTML, CSS, JS)
 * @returns The resource or null if not found
 */
export function getResourceBySlug(slug: string, includeContent = true): Resource | null {
  try {
    const filePath = path.join(process.cwd(), `content/resources/${slug}.json`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const resource = JSON.parse(fileContents) as Resource;
    
    // Ensure the slug matches the filename
    resource.slug = slug;
    
    // Remove content if not requested
    if (!includeContent && resource.content) {
      const { content, ...resourceWithoutContent } = resource;
      return resourceWithoutContent;
    }
    
    return resource;
  } catch (error) {
    console.error(`Error loading resource ${slug}:`, error);
    return null;
  }
}

/**
 * Get all unique tags from all resources
 * @returns Array of unique tags
 */
export function getAllTags(): string[] {
  const resources = getAllResources({ includeContent: false });
  const allTags = resources.flatMap(resource => resource.tags);
  return [...new Set(allTags)].sort();
}

/**
 * Get all unique categories from all resources
 * @returns Array of unique categories
 */
export function getAllCategories(): string[] {
  const resources = getAllResources({ includeContent: false });
  const categories = resources.map(resource => resource.category || 'Uncategorized');
  return [...new Set(categories)].sort();
}

/**
 * Get resources filtered by tags
 * @param tags Tags to filter by (resources must have at least one of these tags)
 * @param includeContent Whether to include the full content
 * @returns Filtered array of resources
 */
export function getResourcesByTags(tags: string[], includeContent = false): Resource[] {
  const resources = getAllResources({ includeContent });
  
  if (tags.length === 0) {
    return resources;
  }
  
  return resources.filter(resource => 
    resource.tags.some(tag => tags.includes(tag))
  );
}

/**
 * Get resources filtered by category
 * @param category Category to filter by
 * @param includeContent Whether to include the full content
 * @returns Filtered array of resources
 */
export function getResourcesByCategory(category: string, includeContent = false): Resource[] {
  const resources = getAllResources({ includeContent });
  
  return resources.filter(resource => 
    (resource.category || 'Uncategorized') === category
  );
}

/**
 * Search resources by query string
 * @param query Search query
 * @param includeContent Whether to include the full content
 * @returns Array of resources matching the query
 */
export function searchResources(query: string, includeContent = false): Resource[] {
  if (!query.trim()) {
    return getAllResources({ includeContent });
  }
  
  const resources = getAllResources({ includeContent });
  const lowerQuery = query.toLowerCase();
  
  return resources.filter(resource => {
    // Search in title, description, and tags
    return (
      resource.title.toLowerCase().includes(lowerQuery) ||
      resource.description.toLowerCase().includes(lowerQuery) ||
      resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });
} 