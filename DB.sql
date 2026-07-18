USE url_saver;

CREATE TABLE IF NOT EXISTS urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  url TEXT,
  description TEXT,
  tags VARCHAR(255),
  notes TEXT,
  category VARCHAR(100) DEFAULT 'General',
  is_favorite TINYINT(1) NOT NULL DEFAULT 0
);

ALTER TABLE urls
ADD COLUMN IF NOT EXISTS is_favorite TINYINT(1) NOT NULL DEFAULT 0;

UPDATE urls
SET is_favorite = 0
WHERE is_favorite IS NULL;

SHOW TABLES;
DESCRIBE urls;
