import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return getComponents(req, res);
    case 'POST':
      return addComponent(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get all components
async function getComponents(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get query parameters
    const { featured, limit, category, tag } = req.query;
    
    // Build the query with Supabase
    let query = db.supabase
      .from('components')
      .select(`
        *,
        component_tags(
          tags(name)
        )
      `);
    
    // Add filters
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (tag) {
      query = query.eq('component_tags.tags.name', tag);
    }
    
    // Order by date (most recent first)
    query = query.order('date', { ascending: false });
    
    // Add limit if specified
    if (limit) {
      query = query.limit(parseInt(limit as string));
    }
    
    // Execute the query
    const { data: components, error } = await query;
    
    if (error) throw error;
    
    // Format the components
    const formattedComponents = components?.map((component: any) => {
      // Extract tags from the nested structure
      const tags = component.component_tags
        ?.map((ct: any) => ct.tags?.name)
        .filter(Boolean) || [];
      
      // Remove the nested component_tags from the result
      const { component_tags, ...componentData } = component;
      
      // Generate default preview image path if not provided
      let previewImage = component.preview_image;
      if (!previewImage && component.category) {
        // Create a standardized path based on category and slug/id
        const slug = component.slug || component.id;
        previewImage = `/images/${component.category.toLowerCase()}/${slug}.jpg`;
      }
      
      return {
        ...componentData,
        tags,
        featured: Boolean(component.featured),
        previewImage: previewImage || null,
        // Ensure camelCase versions of properties are available
        previewVideo: component.preview_video || null,
        mediaType: component.media_type || 'image',
        codeSnippet: component.code_snippet || null,
        demoUrl: component.demo_url || null,
        githubUrl: component.github_url || null,
        externalSourceUrl: component.external_source_url || null,
        moreInformation: component.more_information || null
      };
    }) || [];
    
    return res.status(200).json(formattedComponents);
  } catch (error) {
    console.error('Error fetching components:', error);
    return res.status(500).json({ 
      message: 'Error fetching components',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// Add a new component
async function addComponent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      id = uuidv4(),
      title,
      slug,
      description,
      category,
      date,
      featured,
      author,
      externalSourceUrl,
      implementation,
      moreInformation,
      previewImage,
      previewVideo,
      mediaType,
      media,
      codeSnippet,
      demoUrl,
      githubUrl,
      tags = [],
      content = {}
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }
    
    // Format the date
    const formattedDate = date || new Date().toISOString();
    
    // Generate a slug if not provided
    const generatedSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    // Insert the component
    const { data: component, error } = await db.supabase
      .from('components')
      .insert({
        id,
        title,
        slug: generatedSlug,
        description,
        category,
        date: formattedDate,
        featured: featured || false,
        author,
        external_source_url: externalSourceUrl,
        implementation,
        more_information: moreInformation,
        preview_image: previewImage,
        preview_video: previewVideo,
        media_type: mediaType,
        media,
        code_snippet: codeSnippet,
        demo_url: demoUrl,
        github_url: githubUrl,
        content
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add tags if provided
    if (tags.length > 0) {
      // First, ensure all tags exist
      for (const tagName of tags) {
        // Check if tag exists
        const { data: existingTag } = await db.supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .single();
        
        if (!existingTag) {
          // Create tag if it doesn't exist
          await db.supabase
            .from('tags')
            .insert({ name: tagName });
        }
        
        // Get the tag id
        const { data: tag } = await db.supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .single();
        
        if (tag) {
          // Create component-tag relationship
          await db.supabase
            .from('component_tags')
            .insert({
              component_id: component.id,
              tag_id: tag.id
            });
        }
      }
    }
    
    return res.status(201).json({
      message: 'Component added successfully',
      component: {
        ...component,
        tags
      }
    });
  } catch (error) {
    console.error('Error adding component:', error);
    return res.status(500).json({ 
      message: 'Error adding component',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
