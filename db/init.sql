-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  user_role VARCHAR(255) DEFAULT 'CUSTOMER' NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, password_hash, first_name, last_name, user_role, phone)
VALUES ('a@gmail.com', '$2b$10$Gry7JxYlCR/Acgi/QwumGeLZXXoD12KW2PuI8CQGiDB9QXQ4cQS9K', 'ben', 'star', 'ADMIN', '123123'),
  ('b@gmail.com', '$2b$10$GmqbLioUVbhdkxVWAi.WF.OB1jCq/LM3YgYMhoc/PQxRoEa.Tjweu', 'aen', 'srarts', 'CUSTOMER', '456456');
