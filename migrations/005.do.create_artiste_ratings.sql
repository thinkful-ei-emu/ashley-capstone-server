CREATE TABLE ratings (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  rating INTEGER NOT NULL,
  artwork_id INTEGER REFERENCES artwork(id) on DELETE CASCADE NOT NULL, 
  user_id INTEGER REFERENCES users(id) on DELETE CASCADE NOT NULL, 
  unique (user_id, artwork_id)
)

