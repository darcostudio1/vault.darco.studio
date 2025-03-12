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

// Create two button components
async function migrateButtonComponents() {
  try {
    // Create button components
    const button1Id = uuidv4();
    const button2Id = uuidv4();
    
    const components = [
      {
        id: button1Id,
        title: "Gradient Button",
        slug: "gradient-button",
        description: "A beautiful button with gradient background effect",
        category: "buttons",
        date: new Date().toISOString(),
        featured: false,
        author: "DARCO STUDIO",
        external_source_url: "",
        implementation: "css",
        more_information: "This button uses CSS gradients for a modern look",
        preview_image: "",
        preview_video: "",
        media_type: "image"
      },
      {
        id: button2Id,
        title: "Animated Hover Button",
        slug: "animated-hover-button",
        description: "A button with smooth hover animation effects",
        category: "buttons",
        date: new Date().toISOString(),
        featured: false,
        author: "DARCO STUDIO",
        external_source_url: "",
        implementation: "css",
        more_information: "Uses CSS transitions for smooth hover effects",
        preview_image: "",
        preview_video: "",
        media_type: "image"
      }
    ];
    
    console.log('Inserting button components...');
    const { error: componentsError } = await supabase
      .from('components')
      .upsert(components);
    
    if (componentsError) {
      throw new Error(`Error inserting components: ${componentsError.message}`);
    }
    
    console.log(`Inserted ${components.length} button components successfully`);
    
    // Create component content
    const componentContent = [
      {
        component_id: button1Id,
        html: `<button class="gradient-button">Gradient Button</button>`,
        css: `.gradient-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #ff6b6b, #6b47ff);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.gradient-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(107, 71, 255, 0.4);
}`,
        js: `// No JavaScript needed for this component`,
        external_scripts: ""
      },
      {
        component_id: button2Id,
        html: `<button class="animated-button">Hover Me</button>`,
        css: `.animated-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  background-color: white;
  border: 2px solid #333;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.animated-button:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, 0.1);
  transition: all 0.3s ease;
  z-index: -1;
}

.animated-button:hover {
  color: white;
  background-color: #333;
}

.animated-button:hover:before {
  left: 0;
}`,
        js: `// JavaScript for animated hover effect
document.querySelectorAll('.animated-button').forEach(button => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    button.style.setProperty('--x', \`\${x}px\`);
    button.style.setProperty('--y', \`\${y}px\`);
  });
});`,
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
      { name: "gradient" },
      { name: "hover" },
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
    const gradientTag = retrievedTags.find(tag => tag.name === 'gradient');
    const hoverTag = retrievedTags.find(tag => tag.name === 'hover');
    const cssTag = retrievedTags.find(tag => tag.name === 'css');
    
    const componentTags = [];
    
    // Gradient Button tags
    if (buttonsTag) componentTags.push({ component_id: button1Id, tag_id: buttonsTag.id });
    if (gradientTag) componentTags.push({ component_id: button1Id, tag_id: gradientTag.id });
    if (cssTag) componentTags.push({ component_id: button1Id, tag_id: cssTag.id });
    
    // Animated Hover Button tags
    if (buttonsTag) componentTags.push({ component_id: button2Id, tag_id: buttonsTag.id });
    if (animationTag) componentTags.push({ component_id: button2Id, tag_id: animationTag.id });
    if (hoverTag) componentTags.push({ component_id: button2Id, tag_id: hoverTag.id });
    if (cssTag) componentTags.push({ component_id: button2Id, tag_id: cssTag.id });
    
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
