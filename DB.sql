USE url_saver;

CREATE TABLE IF NOT EXISTS urls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  url TEXT,
  description TEXT,
  tags VARCHAR(255),
  notes TEXT,
  category VARCHAR(100) DEFAULT 'General'
);

SHOW TABLES;
DESCRIBE urls;
