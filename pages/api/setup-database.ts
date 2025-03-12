import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import db from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema into individual statements
    const statements = splitPostgresStatements(schemaSQL);
    
    // Execute each statement using Supabase
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await db.supabase.rpc('execute_sql', { 
          query_text: statement,
          query_params: []
        });
        
        if (error) throw error;
      }
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Database setup completed successfully',
      tablesCreated: statements.length
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error setting up database',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Split PostgreSQL statements properly, handling functions and triggers
 */
function splitPostgresStatements(sql: string): string[] {
  const statements: string[] = [];
  let currentStatement = '';
  let inFunction = false;
  let functionDepth = 0;
  
  // Split by lines to process
  const lines = sql.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip comments
    if (trimmedLine.startsWith('--')) {
      continue;
    }
    
    // Check if we're entering a function/trigger definition
    if (trimmedLine.includes('CREATE OR REPLACE FUNCTION') || 
        trimmedLine.includes('CREATE FUNCTION') ||
        trimmedLine.includes('CREATE TRIGGER')) {
      inFunction = true;
    }
    
    // Track function body depth with dollar quoting
    if (inFunction) {
      if (trimmedLine.includes('$$')) {
        functionDepth = functionDepth === 0 ? 1 : 0;
      }
    }
    
    // Add line to current statement
    currentStatement += line + '\n';
    
    // Check if statement is complete
    if (!inFunction && trimmedLine.endsWith(';')) {
      statements.push(currentStatement.trim());
      currentStatement = '';
    } else if (inFunction && functionDepth === 0 && trimmedLine.endsWith(';')) {
      // Function definition is complete
      statements.push(currentStatement.trim());
      currentStatement = '';
      inFunction = false;
    }
  }
  
  // Add any remaining statement
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  return statements;
}
