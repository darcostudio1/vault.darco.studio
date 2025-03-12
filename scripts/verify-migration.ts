import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from the project's root .env.local file
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.error(`Environment file not found: ${envPath}`);
  process.exit(1);
}

// Log environment variables (without sensitive values)
console.log('Environment variables loaded:');
console.log(`SUPABASE_URL set: ${Boolean(process.env.SUPABASE_URL)}`);
console.log(`SUPABASE_ANON_KEY set: ${Boolean(process.env.SUPABASE_ANON_KEY)}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY set: ${Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)}`);

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and key are required. Please check your .env.local file.');
  process.exit(1);
}

console.log(`Connecting to Supabase at: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyMigration() {
  console.log('Verifying migration to Supabase...');
  
  try {
    // Check components table
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('*')
      .order('date', { ascending: false }); // Most recent first
    
    if (componentsError) {
      throw new Error(`Error fetching components: ${componentsError.message}`);
    }
    
    console.log(`Found ${components?.length || 0} components in Supabase`);
    
    if (components && components.length > 0) {
      console.log('Sample component:');
      console.log(JSON.stringify(components[0], null, 2));
    }
    
    // Check tags table
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('*');
    
    if (tagsError) {
      throw new Error(`Error fetching tags: ${tagsError.message}`);
    }
    
    console.log(`Found ${tags?.length || 0} tags in Supabase`);
    
    // Check component_tags table
    const { data: componentTags, error: componentTagsError } = await supabase
      .from('component_tags')
      .select('*');
    
    if (componentTagsError) {
      throw new Error(`Error fetching component_tags: ${componentTagsError.message}`);
    }
    
    console.log(`Found ${componentTags?.length || 0} component-tag relationships in Supabase`);
    
    // Check component_content table
    const { data: componentContent, error: contentError } = await supabase
      .from('component_content')
      .select('*');
    
    if (contentError) {
      throw new Error(`Error fetching component_content: ${contentError.message}`);
    }
    
    console.log(`Found ${componentContent?.length || 0} component content entries in Supabase`);
    
    console.log('Verification completed successfully!');
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

// Run the verification
verifyMigration();
