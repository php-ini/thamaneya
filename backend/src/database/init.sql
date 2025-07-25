-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create shows table
CREATE TABLE IF NOT EXISTS shows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  language VARCHAR(50),
  duration INTEGER, -- in seconds
  publish_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shows_category ON shows(category);
CREATE INDEX IF NOT EXISTS idx_shows_language ON shows(language);
CREATE INDEX IF NOT EXISTS idx_shows_publish_date ON shows(publish_date);
CREATE INDEX IF NOT EXISTS idx_shows_created_at ON shows(created_at);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_shows_search ON shows USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_shows_updated_at 
    BEFORE UPDATE ON shows 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO shows (title, description, category, language, duration, publish_date) VALUES
('The History of Ancient Egypt', 'A comprehensive documentary series exploring the rich history of Ancient Egypt, from the early dynasties to the Roman conquest.', 'Documentary', 'English', 3600, '2024-01-15 10:00:00'),
('Arabic Poetry Through the Ages', 'An exploration of Arabic poetry from pre-Islamic times to modern day, featuring readings and analysis.', 'Educational', 'Arabic', 2700, '2024-01-20 14:30:00'),
('Modern Science Explained', 'Complex scientific concepts made simple through engaging explanations and visual demonstrations.', 'Educational', 'English', 1800, '2024-01-25 09:15:00'),
('Islamic Architecture', 'A journey through the world''s most beautiful Islamic architectural masterpieces.', 'Documentary', 'Arabic', 4500, '2024-02-01 16:00:00'),
('The Art of Calligraphy', 'Learn the ancient art of Arabic calligraphy with master calligraphers.', 'Educational', 'Arabic', 2400, '2024-02-05 11:30:00'),
('Space Exploration Today', 'Latest developments in space exploration and what the future holds for humanity in space.', 'Documentary', 'English', 3200, '2024-02-10 13:45:00'),
('Arabic Literature Classics', 'Exploring the greatest works of Arabic literature and their impact on world culture.', 'Educational', 'Arabic', 3600, '2024-02-15 15:20:00'),
('Climate Change Solutions', 'Innovative solutions to address climate change and create a sustainable future.', 'Documentary', 'English', 2800, '2024-02-20 10:00:00'),
('Traditional Arabic Music', 'A deep dive into the rich traditions of Arabic music and its influence on world music.', 'Cultural', 'Arabic', 3300, '2024-02-25 12:00:00'),
('Artificial Intelligence Revolution', 'How AI is transforming industries and reshaping our future society.', 'Educational', 'English', 3000, '2024-03-01 14:30:00'); 