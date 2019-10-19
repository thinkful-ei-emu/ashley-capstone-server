  CREATE TABLE gallery_artwork (
  gallery_id INTEGER REFERENCES galleries(id) on DELETE CASCADE,
  artwork_id INTEGER REFERENCES artwork(id) on DELETE CASCADE,
  public BOOLEAN DEFAULT FALSE NOT NULL
)
  
  
  