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

// First, let's check the structure of the tables
async function checkTableStructure(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`Error checking ${tableName} table:`, error.message);
      return false;
    }
    
    console.log(`${tableName} table exists.`);
    if (data && data.length > 0) {
      console.log(`Sample ${tableName} structure:`, data[0]);
    } else {
      console.log(`No existing ${tableName} found.`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error checking ${tableName} table:`, error);
    return false;
  }
}

// Create two sample components
async function createComponents() {
  const component1Id = uuidv4();
  const component2Id = uuidv4();
  
  const components = [
    {
      id: component1Id,
      title: "Animated Button",
      slug: "animated-button",
      description: "A beautiful button with hover animation effects",
      category: "ui",
      date: new Date().toISOString(),
      featured: false,
      author: "Your Name",
      external_source_url: "",
      implementation: "css",
      more_information: "This button uses CSS transitions for smooth animations",
      preview_image: "",
      preview_video: "",
      media_type: "image"
    },
    {
      id: component2Id,
      title: "Responsive Card Layout",
      slug: "responsive-card-layout",
      description: "A responsive card layout that works on all screen sizes",
      category: "layout",
      date: new Date().toISOString(),
      featured: false,
      author: "Your Name",
      external_source_url: "",
      implementation: "css",
      more_information: "Uses CSS Grid for optimal layout",
      preview_image: "",
      preview_video: "",
      media_type: "image"
    }
  ];
  
  console.log('Inserting components...');
  const { error: componentsError } = await supabase
    .from('components')
    .upsert(components);
  
  if (componentsError) {
    console.error(`Error inserting components: ${componentsError.message}`);
    return null;
  }
  
  console.log(`Inserted ${components.length} components successfully`);
  return { components, component1Id, component2Id };
}

// Create component content
async function createComponentContent(components) {
  const componentContent = components.map(component => ({
    component_id: component.id,
    html: `<div class="component-${component.slug}">
  <h2>${component.title}</h2>
  <p>${component.description}</p>
</div>`,
    css: `.component-${component.slug} {
  padding: 20px;
  border-radius: 8px;
  background-color: #f5f5f5;
}`,
    js: `// JavaScript for ${component.title}
console.log('${component.title} loaded');`,
    external_scripts: ""
  }));
  
  console.log('Inserting component content...');
  const { error: contentError } = await supabase
    .from('component_content')
    .upsert(componentContent);
  
  if (contentError) {
    console.error(`Error inserting component_content: ${contentError.message}`);
    return false;
  }
  
  console.log(`Inserted ${componentContent.length} component content entries successfully`);
  return true;
}

// Create tags
async function createTags() {
  const tags = [
    { name: "animation" },
    { name: "layout" },
    { name: "css" },
    { name: "responsive" },
    { name: "ui" }
  ];
  
  console.log('Inserting tags...');
  const { error: tagsError } = await supabase
    .from('tags')
    .upsert(tags, { onConflict: 'name' });
  
  if (tagsError) {
    console.error(`Error inserting tags: ${tagsError.message}`);
    return null;
  }
  
  console.log(`Inserted ${tags.length} tags successfully`);
  
  // Get the inserted tags to use their IDs
  const { data: retrievedTags, error: retrieveTagsError } = await supabase
    .from('tags')
    .select('*');
  
  if (retrieveTagsError) {
    console.error(`Error retrieving tags: ${retrieveTagsError.message}`);
    return null;
  }
  
  console.log(`Retrieved ${retrievedTags.length} tags`);
  return retrievedTags;
}

// Create component-tag relationships
async function createComponentTags(component1Id, component2Id, tags) {
  // Find tag IDs by name
  const animationTag = tags.find(tag => tag.name === 'animation');
  const layoutTag = tags.find(tag => tag.name === 'layout');
  const cssTag = tags.find(tag => tag.name === 'css');
  const responsiveTag = tags.find(tag => tag.name === 'responsive');
  const uiTag = tags.find(tag => tag.name === 'ui');
  
  const componentTags = [];
  
  // Component 1 tags
  if (animationTag) componentTags.push({ component_id: component1Id, tag_id: animationTag.id });
  if (cssTag) componentTags.push({ component_id: component1Id, tag_id: cssTag.id });
  if (uiTag) componentTags.push({ component_id: component1Id, tag_id: uiTag.id });
  
  // Component 2 tags
  if (layoutTag) componentTags.push({ component_id: component2Id, tag_id: layoutTag.id });
  if (cssTag) componentTags.push({ component_id: component2Id, tag_id: cssTag.id });
  if (responsiveTag) componentTags.push({ component_id: component2Id, tag_id: responsiveTag.id });
  
  console.log('Inserting component-tag relationships...');
  const { error: componentTagsError } = await supabase
    .from('component_tags')
    .upsert(componentTags);
  
  if (componentTagsError) {
    console.error(`Error inserting component_tags: ${componentTagsError.message}`);
    return false;
  }
  
  console.log(`Inserted ${componentTags.length} component-tag relationships successfully`);
  return true;
}

// Main migration function
async function migrate() {
  try {
    // Check table structures
    await checkTableStructure('components');
    await checkTableStructure('tags');
    await checkTableStructure('component_tags');
    await checkTableStructure('component_content');
    
    // Create components
    const componentData = await createComponents();
    if (!componentData) return;
    
    // Create component content
    const contentSuccess = await createComponentContent(componentData.components);
    if (!contentSuccess) return;
    
    // Create tags
    const tags = await createTags();
    if (!tags) return;
    
    // Create component-tag relationships
    const tagsSuccess = await createComponentTags(
      componentData.component1Id, 
      componentData.component2Id, 
      tags
    );
    if (!tagsSuccess) return;
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrate();
