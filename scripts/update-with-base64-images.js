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

// Simple base64 encoded SVG images for the components
const burgerButtonSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#3498db"/>
  <g fill="#ffffff">
    <rect x="50" y="60" width="100" height="10" rx="2"/>
    <rect x="50" y="95" width="100" height="10" rx="2"/>
    <rect x="50" y="130" width="100" height="10" rx="2"/>
  </g>
</svg>
`;

const stopMotionButtonSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#e74c3c"/>
  <rect x="50" y="70" width="100" height="60" rx="10" fill="#ffffff"/>
  <g fill="#e74c3c">
    <rect x="70" y="85" width="20" height="30" rx="2"/>
    <rect x="110" y="85" width="20" height="30" rx="2"/>
  </g>
</svg>
`;

// Convert SVG to base64 data URL
function svgToDataUrl(svg) {
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

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
    
    // Convert SVGs to data URLs
    const burgerButtonImage = svgToDataUrl(burgerButtonSvg);
    const stopMotionButtonImage = svgToDataUrl(stopMotionButtonSvg);
    
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
