BEGIN;

TRUNCATE
ratings,
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
('GalleryOne', 1),
('GalleryTwo', 2),
('GalleryThree', 3);



INSERT INTO artwork (title, artpiece_image, gallery_id, user_id)
VALUES
('PuppyOne', 'C:\Users\Ashley\projects\Capstone\ashley-capstone-server\puppy.png', 1, 1),
('PuppyTwo', 'C:\Users\Ashley\projects\Capstone\ashley-capstone-server\puppy.png', 2, 2),
('PuppyThree', 'C:\Users\Ashley\projects\Capstone\ashley-capstone-server\puppy.png', 3, 3),
('PuppyFour', 'C:\Users\Ashley\projects\Capstone\ashley-capstone-server\puppy.png', 1, 1);

INSERT INTO ratings (rating, artwork_id, user_id)
VALUES
(2, 1, 2),
(5, 1, 3),
(3, 2, 3),
(1, 3, 1),
(5, 4, 3);