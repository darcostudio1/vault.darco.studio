import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid component ID' });
  }
  
  switch (req.method) {
    case 'GET':
      return getComponent(req, res, id);
    case 'PUT':
      return updateComponent(req, res, id);
    case 'DELETE':
      return deleteComponent(req, res, id);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get a single component by ID
async function getComponent(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    // Get component details with Supabase
    const { data: component, error: componentError } = await db.supabase
      .from('components')
      .select(`
        *,
        component_tags(
          tags(name)
        )
      `)
      .eq('id', id)
      .single();
    
    if (componentError) {
      if (componentError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Component not found' });
      }
      throw componentError;
    }
    
    // Get component content
    const { data: content, error: contentError } = await db.supabase
      .from('component_content')
      .select('*')
      .eq('component_id', id)
      .maybeSingle();
    
    if (contentError) throw contentError;
    
    // Extract tags from the nested structure
    const tags = component.component_tags
      ?.map((ct: any) => ct.tags?.name)
      .filter(Boolean) || [];
    
    // Remove the nested component_tags from the result
    const { component_tags, ...componentData } = component;
    
    // Format the component data
    const formattedComponent = {
      ...componentData,
      tags,
      featured: Boolean(component.featured),
      content: content ? {
        externalScripts: content.external_scripts,
        html: content.html,
        css: content.css,
        js: content.js
      } : null
    };
    
    return res.status(200).json(formattedComponent);
  } catch (error) {
    console.error('Error fetching component:', error);
    return res.status(500).json({ 
      message: 'Error fetching component',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// Update a component
async function updateComponent(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const {
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
      content,
      tags
    } = req.body;
    
    // Update component
    const { error: componentError } = await db.supabase
      .from('components')
      .update({
        title,
        slug,
        description,
        category,
        date,
        featured,
        author,
        external_source_url: externalSourceUrl,
        implementation,
        more_information: moreInformation,
        preview_image: previewImage,
        preview_video: previewVideo,
        media_type: mediaType
      })
      .eq('id', id);
    
    if (componentError) throw componentError;
    
    // Update component content
    if (content) {
      // Check if content exists
      const { data: existingContent, error: contentCheckError } = await db.supabase
        .from('component_content')
        .select('component_id')
        .eq('component_id', id)
        .maybeSingle();
      
      if (contentCheckError) throw contentCheckError;
      
      if (existingContent) {
        // Update existing content
        const { error: contentUpdateError } = await db.supabase
          .from('component_content')
          .update({
            external_scripts: content.externalScripts || '',
            html: content.html || '',
            css: content.css || '',
            js: content.js || ''
          })
          .eq('component_id', id);
        
        if (contentUpdateError) throw contentUpdateError;
      } else {
        // Insert new content
        const { error: contentInsertError } = await db.supabase
          .from('component_content')
          .insert({
            component_id: id,
            external_scripts: content.externalScripts || '',
            html: content.html || '',
            css: content.css || '',
            js: content.js || ''
          });
        
        if (contentInsertError) throw contentInsertError;
      }
    }
    
    // Handle tags
    if (tags !== undefined) {
      // Remove existing tag associations
      const { error: deleteTagsError } = await db.supabase
        .from('component_tags')
        .delete()
        .eq('component_id', id);
      
      if (deleteTagsError) throw deleteTagsError;
      
      // Add new tags
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          // Get or create tag
          const { data: existingTag, error: tagQueryError } = await db.supabase
            .from('tags')
            .select('id')
            .eq('name', tagName)
            .maybeSingle();
          
          if (tagQueryError) throw tagQueryError;
          
          let tagId;
          
          if (!existingTag) {
            // Insert new tag
            const { data: newTag, error: tagInsertError } = await db.supabase
              .from('tags')
              .insert({ name: tagName })
              .select('id')
              .single();
            
            if (tagInsertError) throw tagInsertError;
            tagId = newTag.id;
          } else {
            tagId = existingTag.id;
          }
          
          // Create component-tag relationship
          const { error: relationError } = await db.supabase
            .from('component_tags')
            .insert({
              component_id: id,
              tag_id: tagId
            });
          
          if (relationError) throw relationError;
        }
      }
    }
    
    return res.status(200).json({ message: 'Component updated successfully' });
  } catch (error) {
    console.error('Error updating component:', error);
    return res.status(500).json({ 
      message: 'Error updating component',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

// Delete a component
async function deleteComponent(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    // Delete component tags
    const { error: tagsError } = await db.supabase
      .from('component_tags')
      .delete()
      .eq('component_id', id);
    
    if (tagsError) throw tagsError;
    
    // Delete component content
    const { error: contentError } = await db.supabase
      .from('component_content')
      .delete()
      .eq('component_id', id);
    
    if (contentError) throw contentError;
    
    // Delete component
    const { error: componentError } = await db.supabase
      .from('components')
      .delete()
      .eq('id', id);
    
    if (componentError) throw componentError;
    
    return res.status(200).json({ message: 'Component deleted successfully' });
  } catch (error) {
    console.error('Error deleting component:', error);
    return res.status(500).json({ 
      message: 'Error deleting component',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
