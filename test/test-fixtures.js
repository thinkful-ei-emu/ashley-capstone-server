function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      first_name: 'mike',
      last_name: 'smith',
      email: 'mikeSmith@gmail.com',
      password: 'password1',
     
    },
    {
      id: 2,
      user_name: 'test-user-2',
      first_name: 'bob',
      last_name: 'parker',
      email: 'bobParker@gmail.com',
      password: 'password2',
     
    },
    {
      id: 3,
      user_name: 'test-user-3',
      first_name: 'mike',
      last_name: 'smith',
      email: 'benGoldstein@gmail.com',
      password: 'password3',
     
    },
    
  ]
}

function makeGalleriesArray(){
  return [
    {
      id: 1,
      name: "GalleryOne",
      user_id: 1
    },
    {
      id: 2,
      name: "GalleryTwo",
      user_id: 2
    },
    {
      id: 3,
      name: "GalleryThree",
      user_id: 3
    }
  ];
}

function makeArtworkArray(){
  return [
    {
      id: 1,
      artpiece_image: 'http://placehold.it/500x500',
      title: "ArtOne",
      gallery_id: 1,
      user_id: 1
    },
    {
      id: 2,
      artpiece_image: 'http://placehold.it/500x500',
      title: "ArtTwo",
      gallery_id: 2,
      user_id: 2
    },
    {
      id: 3,
      artpiece_image: 'http://placehold.it/500x500',
      title: "ArtThree",
      gallery_id: 3,
      user_id: 3
    },
    {
      id: 4,
      artpiece_image: 'http://placehold.it/500x500',
      title: "ArtFour",
      gallery_id: 1,
      user_id: 1
    }
  
  ];
}

function makeRatingsArray() {
  return [
    {
      id: 1,
      rating: 2,      
      artwork_id: 1,
      user_id: 2,
    
    },
    {
      id: 2,
      rating: 3,     
      artwork_id: 1,
      user_id: 3,
     
    },
    {
      id: 3,
      rating: 1,     
      artwork_id: 2,
      user_id: 3,
      
    },
    {
      id: 4,
      rating: 5,     
      artwork_id: 3,
      user_id: 1,
      
    },
    {
      id: 5,
      rating: 5,     
      artwork_id: 4,
      user_id: 3,
      
    },
    
  ];
}

function makeMaliciousGallery() {
  const maliciousGallery = {
    id: 911,
    name: 'Malicious Gallery <script>alert("xss");</script>',
    user_id: 1
   
  };
  const expectedGallery = {
    ...maliciousGallery,
    name: 'Malicious Gallery &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    
  };
  return {
    maliciousGallery,
    expectedGallery,
  };
}







