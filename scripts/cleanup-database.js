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

async function cleanupDatabase() {
  try {
    // Delete all component_tags
    console.log('Deleting all component_tags...');
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
    console.log('Deleting all component_content...');
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
    console.log('Deleting all components...');
    const { error: deleteComponentsError } = await supabase
      .from('components')
      .delete()
      .neq('id', 'placeholder');
    
    if (deleteComponentsError) {
      console.error(`Error deleting components: ${deleteComponentsError.message}`);
    } else {
      console.log('All components deleted successfully');
    }
    
    console.log('Database cleanup completed successfully!');
  } catch (error) {
    console.error('Database cleanup failed:', error);
  }
}

// Run the cleanup
cleanupDatabase();
