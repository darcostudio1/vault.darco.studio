require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Sample components data - replace with your actual component data
const components = [
  {
    id: uuidv4(),
    title: "Component 1",
    slug: "component-1",
    description: "Description for component 1",
    category: "animation",
    date: new Date().toISOString(),
    featured: false,
    author: "Your Name",
    external_source_url: "",
    implementation: "css",
    more_information: "",
    preview_image: "",
    preview_video: "",
    media_type: "image"
  },
  {
    id: uuidv4(),
    title: "Component 2",
    slug: "component-2",
    description: "Description for component 2",
    category: "layout",
    date: new Date().toISOString(),
    featured: false,
    author: "Your Name",
    external_source_url: "",
    implementation: "css",
    more_information: "",
    preview_image: "",
    preview_video: "",
    media_type: "image"
  }
];

// Sample component content
const componentContent = components.map(component => ({
  id: uuidv4(),
  component_id: component.id,
  html: "<div>Sample HTML for " + component.title + "</div>",
  css: "/* CSS for " + component.title + " */",
  js: "// JS for " + component.title,
  external_scripts: ""
}));

// Sample tags
const tags = [
  {
    id: uuidv4(),
    name: "animation"
  },
  {
    id: uuidv4(),
    name: "layout"
  },
  {
    id: uuidv4(),
    name: "css"
  }
];

// Sample component-tag relationships
const componentTags = [
  {
    id: uuidv4(),
    component_id: components[0].id,
    tag_id: tags[0].id
  },
  {
    id: uuidv4(),
    component_id: components[0].id,
    tag_id: tags[2].id
  },
  {
    id: uuidv4(),
    component_id: components[1].id,
    tag_id: tags[1].id
  },
  {
    id: uuidv4(),
    component_id: components[1].id,
    tag_id: tags[2].id
  }
];

async function migrateToSupabase() {
  // Initialize Supabase client
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL and key are required. Please check your .env.local file.');
    process.exit(1);
  }
  
  console.log(`Connecting to Supabase at: ${supabaseUrl}`);
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 1. Insert components
    console.log('Inserting components...');
    const { data: insertedComponents, error: componentsError } = await supabase
      .from('components')
      .upsert(components);
    
    if (componentsError) {
      throw new Error(`Error inserting components: ${componentsError.message}`);
    }
    
    console.log(`Inserted ${components.length} components successfully`);
    
    // 2. Insert tags
    console.log('Inserting tags...');
    const { data: insertedTags, error: tagsError } = await supabase
      .from('tags')
      .upsert(tags);
    
    if (tagsError) {
      throw new Error(`Error inserting tags: ${tagsError.message}`);
    }
    
    console.log(`Inserted ${tags.length} tags successfully`);
    
    // 3. Insert component-tag relationships
    console.log('Inserting component-tag relationships...');
    const { data: insertedComponentTags, error: componentTagsError } = await supabase
      .from('component_tags')
      .upsert(componentTags);
    
    if (componentTagsError) {
      throw new Error(`Error inserting component_tags: ${componentTagsError.message}`);
    }
    
    console.log(`Inserted ${componentTags.length} component-tag relationships successfully`);
    
    // 4. Insert component content
    console.log('Inserting component content...');
    const { data: insertedContent, error: contentError } = await supabase
      .from('component_content')
      .upsert(componentContent);
    
    if (contentError) {
      throw new Error(`Error inserting component_content: ${contentError.message}`);
    }
    
    console.log(`Inserted ${componentContent.length} component content entries successfully`);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateToSupabase();
