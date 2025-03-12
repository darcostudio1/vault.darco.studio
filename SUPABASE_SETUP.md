# Supabase Setup Guide for vault.darco.studio

This guide will help you set up your Supabase database for the vault.darco.studio project.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Choose a name for your project and set a secure database password
4. Select a region closest to your users
5. Wait for your database to be provisioned

## 2. Get Your API Keys

1. In your Supabase project dashboard, go to Project Settings > API
2. Copy the following values:
   - **URL**: Your Supabase project URL
   - **anon public key**: Your anonymous/public API key
   - **service_role key**: Your service role key (for admin operations)

3. Add these values to your `.env.local` file:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

## 3. Create the SQL Function for Custom Queries

1. In your Supabase dashboard, go to SQL Editor
2. Create a new query
3. Paste the contents of the `supabase/execute_sql.sql` file
4. Run the query to create the function

## 4. Set Up Database Tables

You have two options to set up your database tables:

### Option 1: Use the API Endpoint

1. Start your Next.js application locally
2. Navigate to `/admin/database-setup`
3. Click on "Setup Database" to create all required tables

### Option 2: Manual SQL Execution

1. In your Supabase dashboard, go to SQL Editor
2. Create a new query
3. Paste the contents of the `lib/schema.sql` file
4. Run the query to create all tables

## 5. Database Tables Structure

The application uses the following tables:

1. **components**: Stores main component information
2. **component_content**: Stores HTML, CSS, and JS content for each component
3. **tags**: Stores available tags
4. **component_tags**: Manages the many-to-many relationship between components and tags

## 6. Security Settings

For production use, make sure to:

1. Set up Row Level Security (RLS) policies for your tables
2. Create appropriate API roles with limited permissions
3. Consider using Supabase Auth for user authentication

## 7. Testing the Connection

After setting up your Supabase database:

1. Start your Next.js application locally
2. Navigate to `/api/check-connection` to verify the database connection
3. Navigate to `/api/check-tables` to verify that all required tables exist

If you encounter any issues, check your environment variables and make sure the Supabase project is properly set up.
