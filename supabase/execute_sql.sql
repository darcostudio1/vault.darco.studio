-- Create a custom SQL execution function in Supabase
-- This function allows executing arbitrary SQL with parameters
-- Note: This requires appropriate permissions in Supabase

CREATE OR REPLACE FUNCTION execute_sql(query_text TEXT, query_params JSONB DEFAULT '[]'::JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  query TEXT;
  i INTEGER;
BEGIN
  query := query_text;
  
  -- Replace parameters in the query
  FOR i IN 0..jsonb_array_length(query_params) - 1 LOOP
    query := replace(query, '$' || (i + 1)::TEXT, quote_literal(query_params->i));
  END LOOP;
  
  -- Execute the query and return results as JSON
  EXECUTE 'SELECT to_jsonb(array_agg(row_to_json(t))) FROM (' || query || ') t' INTO result;
  
  RETURN COALESCE(result, '[]'::JSONB);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;
