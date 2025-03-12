import mysql from 'serverless-mysql';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
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

// Define types for database tables
interface Component {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  featured: boolean;
  author: string;
  external_source_url: string;
  implementation: string;
  more_information: string;
  preview_image: string;
  preview_video: string;
  media_type: string;
  created_at?: string;
  updated_at?: string;
}

interface Tag {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

interface ComponentTag {
  id?: string;
  component_id: string;
  tag_id: string;
  created_at?: string;
  updated_at?: string;
}

interface ComponentContent {
  id?: string;
  component_id: string;
  html: string;
  css: string;
  js: string;
  external_scripts: string;
  created_at?: string;
  updated_at?: string;
}

// Log environment variables (without sensitive values)
console.log('Environment variables loaded:');
console.log(`MYSQL_HOST: ${process.env.MYSQL_HOST}`);
console.log(`MYSQL_DATABASE: ${process.env.MYSQL_DATABASE}`);
console.log(`MYSQL_USER: ${process.env.MYSQL_USER}`);
console.log(`SUPABASE_URL set: ${Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)}`);
console.log(`SUPABASE_KEY set: ${Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}`);

// MySQL connection
const mysqlDb = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
});

// Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and key are required. Please check your .env.local file.');
  process.exit(1);
}

console.log(`Connecting to Supabase at: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log('Starting migration from MySQL to Supabase...');
  
  try {
    // 1. Migrate components table
    console.log('Migrating components...');
    const components = await mysqlDb.query<Component[]>('SELECT * FROM components ORDER BY date DESC');
    
    if (components.length > 0) {
      // Insert components into Supabase
      const { data: insertedComponents, error: componentsError } = await supabase
        .from('components')
        .upsert(components.map((component: Component) => ({
          id: component.id,
          title: component.title,
          slug: component.slug,
          description: component.description,
          category: component.category,
          date: component.date,
          featured: component.featured,
          author: component.author,
          external_source_url: component.external_source_url,
          implementation: component.implementation,
          more_information: component.more_information,
          preview_image: component.preview_image,
          preview_video: component.preview_video,
          media_type: component.media_type,
          created_at: component.created_at || new Date().toISOString(),
          updated_at: component.updated_at || new Date().toISOString()
        })));
      
      if (componentsError) {
        throw new Error(`Error inserting components: ${componentsError.message}`);
      }
      
      console.log(`Migrated ${components.length} components successfully`);
    } else {
      console.log('No components to migrate');
    }
    
    // 2. Migrate tags table
    console.log('Migrating tags...');
    const tags = await mysqlDb.query<Tag[]>('SELECT * FROM tags');
    
    if (tags.length > 0) {
      // Insert tags into Supabase
      const { data: insertedTags, error: tagsError } = await supabase
        .from('tags')
        .upsert(tags.map((tag: Tag) => ({
          id: tag.id,
          name: tag.name,
          created_at: tag.created_at || new Date().toISOString(),
          updated_at: tag.updated_at || new Date().toISOString()
        })));
      
      if (tagsError) {
        throw new Error(`Error inserting tags: ${tagsError.message}`);
      }
      
      console.log(`Migrated ${tags.length} tags successfully`);
    } else {
      console.log('No tags to migrate');
    }
    
    // 3. Migrate component_tags table
    console.log('Migrating component-tag relationships...');
    const componentTags = await mysqlDb.query<ComponentTag[]>('SELECT * FROM component_tags');
    
    if (componentTags.length > 0) {
      // Insert component_tags into Supabase
      const { data: insertedComponentTags, error: componentTagsError } = await supabase
        .from('component_tags')
        .upsert(componentTags.map((ct: ComponentTag) => ({
          id: ct.id || uuidv4(),
          component_id: ct.component_id,
          tag_id: ct.tag_id,
          created_at: ct.created_at || new Date().toISOString(),
          updated_at: ct.updated_at || new Date().toISOString()
        })));
      
      if (componentTagsError) {
        throw new Error(`Error inserting component_tags: ${componentTagsError.message}`);
      }
      
      console.log(`Migrated ${componentTags.length} component-tag relationships successfully`);
    } else {
      console.log('No component-tag relationships to migrate');
    }
    
    // 4. Migrate component_content table
    console.log('Migrating component content...');
    const componentContent = await mysqlDb.query<ComponentContent[]>('SELECT * FROM component_content');
    
    if (componentContent.length > 0) {
      // Insert component_content into Supabase
      const { data: insertedContent, error: contentError } = await supabase
        .from('component_content')
        .upsert(componentContent.map((content: ComponentContent) => ({
          id: content.id || uuidv4(),
          component_id: content.component_id,
          html: content.html,
          css: content.css,
          js: content.js,
          external_scripts: content.external_scripts,
          created_at: content.created_at || new Date().toISOString(),
          updated_at: content.updated_at || new Date().toISOString()
        })));
      
      if (contentError) {
        throw new Error(`Error inserting component_content: ${contentError.message}`);
      }
      
      console.log(`Migrated ${componentContent.length} component content entries successfully`);
    } else {
      console.log('No component content to migrate');
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close MySQL connection
    await mysqlDb.end();
  }
}

// Run the migration
migrateData();
