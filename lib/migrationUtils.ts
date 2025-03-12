import { query } from './db';

// Interface for component data structure
interface ComponentContent {
  externalScripts: string;
  html: string;
  css: string;
  js: string;
}

interface Component {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  featured: boolean;
  tags: string[];
  author: string;
  externalSourceUrl: string;
  implementation: string;
  moreInformation: string;
  content: ComponentContent;
  previewImage: string | null;
  previewVideo: string | null;
  mediaType: string | null;
}

/**
 * Migrate components from localStorage to MySQL database
 */
export async function migrateComponentsToDatabase() {
  try {
    // Get components from localStorage (client-side only)
    if (typeof window === 'undefined') {
      console.log('Migration can only be run in browser environment');
      return { success: false, message: 'Migration can only be run in browser environment' };
    }
    
    const localStorageComponents = localStorage.getItem('customComponents');
    if (!localStorageComponents) {
      return { success: true, message: 'No components to migrate' };
    }
    
    const components: Component[] = JSON.parse(localStorageComponents);
    if (!components.length) {
      return { success: true, message: 'No components to migrate' };
    }
    
    // Make API calls to add each component to the database
    const results = await Promise.all(
      components.map(async (component) => {
        try {
          const response = await fetch('/api/components', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(component),
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to migrate component');
          }
          
          return { success: true, component: component.title };
        } catch (error) {
          console.error(`Error migrating component ${component.title}:`, error);
          return { success: false, component: component.title, error };
        }
      })
    );
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    return {
      success: failed === 0,
      message: `Migration completed: ${successful} components migrated successfully, ${failed} failed`,
      results
    };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, message: 'Migration failed', error };
  }
}

/**
 * Check if database tables exist and are properly set up
 * This function should only be called from API routes (server-side)
 */
export async function checkDatabaseSetup() {
  // Import query function only on server-side
  if (typeof window !== 'undefined') {
    return {
      ready: false,
      message: 'This function can only be called from the server'
    };
  }
  
  try {
    // Dynamic import to ensure this only runs on the server
    const { query } = await import('./db');
    
    // Check if components table exists
    const tables = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [process.env.MYSQL_DATABASE || '']);
    
    const tableNames = tables.map((t: any) => t.table_name.toLowerCase());
    const requiredTables = ['components', 'component_content', 'tags', 'component_tags'];
    
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      return {
        ready: false,
        message: `Missing tables: ${missingTables.join(', ')}`,
        missingTables
      };
    }
    
    return { ready: true, message: 'Database is properly set up' };
  } catch (error) {
    console.error('Database setup check error:', error);
    return {
      ready: false,
      message: 'Failed to check database setup',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
