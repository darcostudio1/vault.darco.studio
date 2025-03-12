require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and key are required. Please check your .env.local file.');
  process.exit(1);
}

console.log(`Connecting to Supabase at: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

// First, let's clean up the database
async function cleanupDatabase() {
  try {
    console.log('Cleaning up database...');
    
    // Delete all component_tags
    const { error: deleteComponentTagsError } = await supabase
      .from('component_tags')
      .delete()
      .neq('component_id', 'placeholder');
    
    if (deleteComponentTagsError) {
      console.error(`Error deleting component_tags: ${deleteComponentTagsError.message}`);
    } else {
      console.log('All component_tags deleted successfully');
    }
    
    // Delete all component_content
    const { error: deleteContentError } = await supabase
      .from('component_content')
      .delete()
      .neq('component_id', 'placeholder');
    
    if (deleteContentError) {
      console.error(`Error deleting component_content: ${deleteContentError.message}`);
    } else {
      console.log('All component_content deleted successfully');
    }
    
    // Delete all components
    const { error: deleteComponentsError } = await supabase
      .from('components')
      .delete()
      .neq('id', 'placeholder');
    
    if (deleteComponentsError) {
      console.error(`Error deleting components: ${deleteComponentsError.message}`);
    } else {
      console.log('All components deleted successfully');
    }
    
    console.log('Database cleanup completed');
  } catch (error) {
    console.error('Database cleanup failed:', error);
  }
}

// Create the specific button components
async function migrateButtonComponents() {
  try {
    // First clean up the database
    await cleanupDatabase();
    
    // Create button components
    const burgerButtonId = uuidv4();
    const stopMotionButtonId = uuidv4();
    
    // Use previewImage instead of preview_image to match the frontend
    const components = [
      {
        id: burgerButtonId,
        title: "Burger Menu Button",
        slug: "burger-menu-button",
        description: "An animated hamburger menu button that transforms into an X",
        category: "buttons",
        date: new Date().toISOString(),
        featured: false,
        author: "DARCO STUDIO",
        externalSourceUrl: "",
        implementation: "css",
        moreInformation: "This button uses CSS transitions to animate between hamburger and X states",
        previewImage: "https://via.placeholder.com/300x200/3498db/ffffff?text=Burger+Menu",
        previewVideo: "",
        mediaType: "image"
      },
      {
        id: stopMotionButtonId,
        title: "Stop Motion Button",
        slug: "stop-motion-button",
        description: "A button with a stop-motion animation effect on hover",
        category: "buttons",
        date: new Date(new Date().getTime() - 86400000).toISOString(), // 1 day older
        featured: false,
        author: "DARCO STUDIO",
        externalSourceUrl: "",
        implementation: "css",
        moreInformation: "Uses CSS animations to create a stop-motion effect",
        previewImage: "https://via.placeholder.com/300x200/e74c3c/ffffff?text=Stop+Motion",
        previewVideo: "",
        mediaType: "image"
      }
    ];
    
    console.log('Inserting button components...');
    
    // Map the component fields to match the database column names
    const dbComponents = components.map(component => ({
      id: component.id,
      title: component.title,
      slug: component.slug,
      description: component.description,
      category: component.category,
      date: component.date,
      featured: component.featured,
      author: component.author,
      external_source_url: component.externalSourceUrl,
      implementation: component.implementation,
      more_information: component.moreInformation,
      preview_image: component.previewImage,
      preview_video: component.previewVideo,
      media_type: component.mediaType
    }));
    
    const { error: componentsError } = await supabase
      .from('components')
      .upsert(dbComponents);
    
    if (componentsError) {
      throw new Error(`Error inserting components: ${componentsError.message}`);
    }
    
    console.log(`Inserted ${components.length} button components successfully`);
    
    // Create component content
    const componentContent = [
      {
        component_id: burgerButtonId,
        html: `<button class="burger-menu-button">
  <span class="burger-bar"></span>
  <span class="burger-bar"></span>
  <span class="burger-bar"></span>
</button>`,
        css: `.burger-menu-button {
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.burger-bar {
  width: 100%;
  height: 4px;
  background-color: #333;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.burger-menu-button.active .burger-bar:nth-child(1) {
  transform: translateY(13px) rotate(45deg);
}

.burger-menu-button.active .burger-bar:nth-child(2) {
  opacity: 0;
}

.burger-menu-button.active .burger-bar:nth-child(3) {
  transform: translateY(-13px) rotate(-45deg);
}`,
        js: `// JavaScript for burger menu button
document.querySelectorAll('.burger-menu-button').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
  });
});`,
        external_scripts: ""
      },
      {
        component_id: stopMotionButtonId,
        html: `<button class="stop-motion-button">Click Me</button>`,
        css: `.stop-motion-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #3498db;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stop-motion-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="0" y="0" /><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="40" y="0" /><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="80" y="0" /><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="20" y="20" /><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="60" y="20" /><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="0" y="40" /><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="40" y="40" /><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="80" y="40" /><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="20" y="60" /><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="60" y="60" /><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="0" y="80" /><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="40" y="80" /><rect fill="%23ffffff" opacity="0.2" width="20" height="20" x="80" y="80" /></svg>');
  opacity: 0;
  transition: opacity 0.1s;
}

.stop-motion-button:hover::before {
  opacity: 1;
  animation: stopMotion 0.5s steps(5) infinite;
}

@keyframes stopMotion {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(20px);
  }
}`,
        js: `// No additional JavaScript needed for the stop motion effect`,
        external_scripts: ""
      }
    ];
    
    console.log('Inserting component content...');
    const { error: contentError } = await supabase
      .from('component_content')
      .upsert(componentContent);
    
    if (contentError) {
      throw new Error(`Error inserting component_content: ${contentError.message}`);
    }
    
    console.log(`Inserted ${componentContent.length} component content entries successfully`);
    
    // Create tags
    const tags = [
      { name: "buttons" },
      { name: "animation" },
      { name: "menu" },
      { name: "hamburger" },
      { name: "stop-motion" },
      { name: "css" }
    ];
    
    console.log('Inserting tags...');
    const { error: tagsError } = await supabase
      .from('tags')
      .upsert(tags, { onConflict: 'name' });
    
    if (tagsError) {
      throw new Error(`Error inserting tags: ${tagsError.message}`);
    }
    
    console.log(`Inserted/updated ${tags.length} tags successfully`);
    
    // Get the inserted tags to use their IDs
    const { data: retrievedTags, error: retrieveTagsError } = await supabase
      .from('tags')
      .select('*');
    
    if (retrieveTagsError) {
      throw new Error(`Error retrieving tags: ${retrieveTagsError.message}`);
    }
    
    // Create component-tag relationships
    const buttonsTag = retrievedTags.find(tag => tag.name === 'buttons');
    const animationTag = retrievedTags.find(tag => tag.name === 'animation');
    const menuTag = retrievedTags.find(tag => tag.name === 'menu');
    const hamburgerTag = retrievedTags.find(tag => tag.name === 'hamburger');
    const stopMotionTag = retrievedTags.find(tag => tag.name === 'stop-motion');
    const cssTag = retrievedTags.find(tag => tag.name === 'css');
    
    const componentTags = [];
    
    // Burger Menu Button tags
    if (buttonsTag) componentTags.push({ component_id: burgerButtonId, tag_id: buttonsTag.id });
    if (animationTag) componentTags.push({ component_id: burgerButtonId, tag_id: animationTag.id });
    if (menuTag) componentTags.push({ component_id: burgerButtonId, tag_id: menuTag.id });
    if (hamburgerTag) componentTags.push({ component_id: burgerButtonId, tag_id: hamburgerTag.id });
    if (cssTag) componentTags.push({ component_id: burgerButtonId, tag_id: cssTag.id });
    
    // Stop Motion Button tags
    if (buttonsTag) componentTags.push({ component_id: stopMotionButtonId, tag_id: buttonsTag.id });
    if (animationTag) componentTags.push({ component_id: stopMotionButtonId, tag_id: animationTag.id });
    if (stopMotionTag) componentTags.push({ component_id: stopMotionButtonId, tag_id: stopMotionTag.id });
    if (cssTag) componentTags.push({ component_id: stopMotionButtonId, tag_id: cssTag.id });
    
    console.log('Inserting component-tag relationships...');
    const { error: componentTagsError } = await supabase
      .from('component_tags')
      .upsert(componentTags);
    
    if (componentTagsError) {
      throw new Error(`Error inserting component_tags: ${componentTagsError.message}`);
    }
    
    console.log(`Inserted ${componentTags.length} component-tag relationships successfully`);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateButtonComponents();
