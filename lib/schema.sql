-- Database schema for vault.darco.studio (PostgreSQL version)

-- Components table
CREATE TABLE IF NOT EXISTS components (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100),
  date DATE,
  featured BOOLEAN DEFAULT FALSE,
  author VARCHAR(255),
  external_source_url VARCHAR(255),
  implementation TEXT,
  more_information TEXT,
  preview_image VARCHAR(255),
  preview_video VARCHAR(255),
  media_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add update trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_components_modtime
BEFORE UPDATE ON components
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Component content table
CREATE TABLE IF NOT EXISTS component_content (
  component_id VARCHAR(255) PRIMARY KEY,
  external_scripts TEXT,
  html TEXT,
  css TEXT,
  js TEXT,
  FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Component tags (many-to-many relationship)
CREATE TABLE IF NOT EXISTS component_tags (
  component_id VARCHAR(255),
  tag_id INTEGER,
  PRIMARY KEY (component_id, tag_id),
  FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Index for faster searches
CREATE INDEX IF NOT EXISTS idx_component_title ON components(title);
CREATE INDEX IF NOT EXISTS idx_component_category ON components(category);
CREATE INDEX IF NOT EXISTS idx_component_date ON components(date);
CREATE INDEX IF NOT EXISTS idx_component_featured ON components(featured);
