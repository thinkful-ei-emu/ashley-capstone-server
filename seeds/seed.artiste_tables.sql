BEGIN;

TRUNCATE
ratings,
gallery_artwork,
artwork,
galleries,
users
RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, first_name, last_name, email, password)
VALUES
('userOne', 'Mike', 'Smith', 'mikeSmith@gmail.com', 'password1'),
('userTwo', 'Bob', 'Parker', 'bobParker@gmail.com', 'password2'),
('userThree', 'Ben', 'Goldstein', 'benGoldstein@gmail.com', 'password3');

INSERT INTO galleries (name, user_id )
VALUES
('Non-active Dogs', 1),
('Active Dogs', 2);

INSERT INTO artwork (title, artpiece_image, artist, user_id) VALUES 
('Smiling dog', 'https://hips.hearstapps.com/wdy.h-cdn.co/assets/17/39/1506709524-cola-0247.jpg?crop=1.00xw:0.750xh;0,0.226xh&resize=980:*', 'picasso1', 1),
('Fluffy dog', 'https://d17fnq9dkz9hgj.cloudfront.net/uploads/2018/04/Pomeranian_02.jpg', 'picasso1', 1),
('Running dog', 'https://www.sheknows.com/wp-content/uploads/2018/08/fajkx3pdvvt9ax6btssg.jpeg?w=695&h=391&crop=1', 'monet30', 2);

INSERT INTO gallery_artwork(gallery_id, artwork_id, public)
VALUES
(1, 1, true),
(1, 2, true),
(2, 3, false);

-- INSERT INTO ratings (rating, artwork_id, user_id)
-- VALUES
-- (2, 1, 1),
-- (5, 2, 1),
-- (5, 3, 1),
