-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add update trigger for updated_at
CREATE TRIGGER update_categories_modtime
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Index for faster searches
CREATE INDEX IF NOT EXISTS idx_category_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_category_slug ON categories(slug);

-- Populate initial categories from existing components
INSERT INTO categories (name, slug, description)
SELECT DISTINCT 
  category, 
  LOWER(category) AS slug,
  category || ' components' AS description
FROM components
WHERE category IS NOT NULL AND category != ''
ON CONFLICT (name) DO NOTHING;
