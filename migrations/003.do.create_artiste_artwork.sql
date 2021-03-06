CREATE TABLE artwork (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,  
  artpiece_image TEXT NOT NULL,
  uploaded TIMESTAMPTZ DEFAULT now() NOT NULL,
  artist TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) on DELETE CASCADE NOT NULL
)