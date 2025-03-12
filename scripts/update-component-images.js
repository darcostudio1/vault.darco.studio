require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and key are required. Please check your .env.local file.');
  process.exit(1);
}

console.log(`Connecting to Supabase at: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateComponentImages() {
  try {
    // First, get the existing components
    const { data: components, error: fetchError } = await supabase
      .from('components')
      .select('*');
    
    if (fetchError) {
      throw new Error(`Error fetching components: ${fetchError.message}`);
    }
    
    if (!components || components.length === 0) {
      console.log('No components found to update');
      return;
    }
    
    console.log(`Found ${components.length} components to update`);
    
    // Sample image URLs - in a real scenario, you would upload these to Supabase Storage
    // For now, we'll use placeholder images
    const burgerButtonImage = 'https://placehold.co/600x400/3498db/ffffff?text=Burger+Menu+Button';
    const stopMotionButtonImage = 'https://placehold.co/600x400/e74c3c/ffffff?text=Stop+Motion+Button';
    
    // Update each component with appropriate image
    for (const component of components) {
      let imageUrl = '';
      
      if (component.title.includes('Burger')) {
        imageUrl = burgerButtonImage;
      } else if (component.title.includes('Stop Motion')) {
        imageUrl = stopMotionButtonImage;
      }
      
      if (imageUrl) {
        console.log(`Updating image for component: ${component.title}`);
        
        const { error: updateError } = await supabase
          .from('components')
          .update({ 
            preview_image: imageUrl,
            media_type: 'image'
          })
          .eq('id', component.id);
        
        if (updateError) {
          console.error(`Error updating component ${component.title}: ${updateError.message}`);
        } else {
          console.log(`Successfully updated image for ${component.title}`);
        }
      }
    }
    
    console.log('Component image updates completed');
  } catch (error) {
    console.error('Update failed:', error);
  }
}

// Run the update
updateComponentImages();
