CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,


);


ALTER TABLE galleries (
  ADD COLUMN
    user_id INTEGER REFERENCES users(id)
    ON DELETE SET NULL;
)
  
