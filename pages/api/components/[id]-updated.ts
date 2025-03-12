import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { deleteMediaFromSupabase } from '../../../lib/supabaseStorage';

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
        ),
        component_content(*)
      `)
      .eq('id', id)
      .single();
    
    if (componentError) {
      if (componentError.code === 'PGRST116') {
        return res.status(404).json({ message: 'Component not found' });
      }
      throw componentError;
    }
    
    // Extract tags from the nested structure
    const tags = component.component_tags
      ?.map((ct: any) => ct.tags?.name)
      .filter(Boolean) || [];
    
    // Extract content from component_content
    let formattedContent = null;
    if (component.component_content && Array.isArray(component.component_content)) {
      const htmlContent = component.component_content.find((c: any) => c.type === 'html');
      const cssContent = component.component_content.find((c: any) => c.type === 'css');
      const jsContent = component.component_content.find((c: any) => c.type === 'js');
      const externalContent = component.component_content.find((c: any) => c.type === 'external');
      
      formattedContent = {
        html: htmlContent?.content || '',
        css: cssContent?.content || '',
        js: jsContent?.content || '',
        externalScripts: externalContent?.content || '',
        external_scripts: externalContent?.content || ''
      };
    } else if (component.content) {
      // If content is stored directly in the component
      formattedContent = {
        html: component.content.html || '',
        css: component.content.css || '',
        js: component.content.js || '',
        externalScripts: component.content.externalScripts || component.content.external_scripts || '',
        external_scripts: component.content.externalScripts || component.content.external_scripts || ''
      };
    }
    
    // Remove the nested structures from the result
    const { component_tags, component_content, ...componentData } = component;
    
    // Format the component data
    const formattedComponent = {
      ...componentData,
      tags,
      featured: Boolean(component.featured),
      // Ensure both camelCase and snake_case versions are available
      previewImage: component.preview_image || null,
      preview_image: component.preview_image || null,
      previewVideo: component.preview_video || null,
      preview_video: component.preview_video || null,
      mediaType: component.media_type || 'image',
      media_type: component.media_type || 'image',
      externalSourceUrl: component.external_source_url || null,
      external_source_url: component.external_source_url || null,
      moreInformation: component.more_information || null,
      more_information: component.more_information || null,
      content: formattedContent
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
    
    // Get existing component to check for media changes
    const { data: existingComponent } = await db.supabase
      .from('components')
      .select('preview_image, preview_video')
      .eq('id', id)
      .single();
    
    // Check if media files need to be deleted
    if (existingComponent) {
      // If preview image has changed and old one was in Supabase storage, delete it
      if (existingComponent.preview_image && 
          existingComponent.preview_image !== previewImage && 
          existingComponent.preview_image.includes('supabase.co')) {
        try {
          await deleteMediaFromSupabase(existingComponent.preview_image);
        } catch (error) {
          console.error('Error deleting old preview image:', error);
          // Continue with update even if delete fails
        }
      }
      
      // If preview video has changed and old one was in Supabase storage, delete it
      if (existingComponent.preview_video && 
          existingComponent.preview_video !== previewVideo && 
          existingComponent.preview_video.includes('supabase.co')) {
        try {
          await deleteMediaFromSupabase(existingComponent.preview_video);
        } catch (error) {
          console.error('Error deleting old preview video:', error);
          // Continue with update even if delete fails
        }
      }
    }
    
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
            external_scripts: content.externalScripts || content.external_scripts || '',
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
            external_scripts: content.externalScripts || content.external_scripts || '',
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
          const { error: tagLinkError } = await db.supabase
            .from('component_tags')
            .insert({
              component_id: id,
              tag_id: tagId
            });
          
          if (tagLinkError) throw tagLinkError;
        }
      }
    }
    
    // Get updated component
    const { data: updatedComponent, error: getError } = await db.supabase
      .from('components')
      .select(`
        *,
        component_tags(
          tags(name)
        )
      `)
      .eq('id', id)
      .single();
    
    if (getError) throw getError;
    
    // Extract tags from the updated component
    const updatedTags = updatedComponent.component_tags
      ?.map((ct: any) => ct.tags?.name)
      .filter(Boolean) || [];
    
    // Remove the nested component_tags from the result
    const { component_tags, ...updatedComponentData } = updatedComponent;
    
    return res.status(200).json({
      message: 'Component updated successfully',
      component: {
        ...updatedComponentData,
        tags: updatedTags
      }
    });
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
    // Get component to check for media files
    const { data: component } = await db.supabase
      .from('components')
      .select('preview_image, preview_video')
      .eq('id', id)
      .single();
    
    // Delete media files from Supabase storage if they exist
    if (component) {
      if (component.preview_image && component.preview_image.includes('supabase.co')) {
        try {
          await deleteMediaFromSupabase(component.preview_image);
        } catch (error) {
          console.error('Error deleting preview image:', error);
          // Continue with deletion even if media delete fails
        }
      }
      
      if (component.preview_video && component.preview_video.includes('supabase.co')) {
        try {
          await deleteMediaFromSupabase(component.preview_video);
        } catch (error) {
          console.error('Error deleting preview video:', error);
          // Continue with deletion even if media delete fails
        }
      }
    }
    
    // Delete component tags
    const { error: tagDeleteError } = await db.supabase
      .from('component_tags')
      .delete()
      .eq('component_id', id);
    
    if (tagDeleteError) throw tagDeleteError;
    
    // Delete component content
    const { error: contentDeleteError } = await db.supabase
      .from('component_content')
      .delete()
      .eq('component_id', id);
    
    if (contentDeleteError) throw contentDeleteError;
    
    // Delete component
    const { error: componentDeleteError } = await db.supabase
      .from('components')
      .delete()
      .eq('id', id);
    
    if (componentDeleteError) throw componentDeleteError;
    
    return res.status(200).json({ message: 'Component deleted successfully' });
  } catch (error) {
    console.error('Error deleting component:', error);
    return res.status(500).json({ 
      message: 'Error deleting component',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
