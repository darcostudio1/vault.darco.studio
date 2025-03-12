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

// SVG images for the components
const burgerMenuSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" fill="#3498db"/>
  <rect x="25" y="30" width="50" height="5" fill="white"/>
  <rect x="25" y="45" width="50" height="5" fill="white"/>
  <rect x="25" y="60" width="50" height="5" fill="white"/>
</svg>`;

const stopMotionSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" fill="#e74c3c"/>
  <circle cx="50" cy="50" r="25" fill="white"/>
  <rect x="35" y="35" width="30" height="30" fill="#e74c3c"/>
</svg>`;

// Function to update component images
async function updateComponentImages() {
  try {
    console.log('Updating component images...');
    
    // Get all components
    const { data: components, error: getError } = await supabase
      .from('components')
      .select('*');
    
    if (getError) {
      throw new Error(`Error fetching components: ${getError.message}`);
    }
    
    if (!components || components.length === 0) {
      console.log('No components found to update');
      return;
    }
    
    console.log(`Found ${components.length} components to update`);
    
    // Update each component with the appropriate SVG image
    for (const component of components) {
      let svgImage;
      
      if (component.title.toLowerCase().includes('burger')) {
        svgImage = `data:image/svg+xml;base64,${Buffer.from(burgerMenuSvg).toString('base64')}`;
      } else if (component.title.toLowerCase().includes('stop motion')) {
        svgImage = `data:image/svg+xml;base64,${Buffer.from(stopMotionSvg).toString('base64')}`;
      } else {
        console.log(`Skipping component "${component.title}" - no matching SVG`);
        continue;
      }
      
      // Update the component with the SVG image
      const { error: updateError } = await supabase
        .from('components')
        .update({ preview_image: svgImage })
        .eq('id', component.id);
      
      if (updateError) {
        console.error(`Error updating component "${component.title}": ${updateError.message}`);
      } else {
        console.log(`Updated component "${component.title}" with SVG image`);
      }
    }
    
    console.log('Component image update completed');
  } catch (error) {
    console.error('Error updating component images:', error);
  }
}

// Run the update function
updateComponentImages();
