const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeAllFixtures() {
  const testUsers = makeUsersArray() 
  const testGalleries = makeGalleriesArray(testUsers)
  const testArtwork = makeArtworkArray(testUsers, testGalleries)
  return { testUsers, testGalleries, testArtwork }
}


function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      galleries,
      users,
      artwork,
      ratings
      RESTART IDENTITY CASCADE`
  )
}

function seedAllTables(db, users, galleries, artwork=[]) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('galleries').insert(galleries)
    await trx.raw(
      `SELECT setval('galleries_id_seq',?)`,
      [galleries[galleries.length - 1].id],  
    )
    if(artwork.length > 0){
      await trx.into('artwork').insert(artwork);
    }
  })
}

function makeExpectedGallery(galleries, users, index) {
  return expectedGalleries = galleries.filter(gallery => (
    gallery.user_id === users[index].id            
    ))

}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {  
  const token = jwt.sign({user_id: user.id}, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

  
function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
     ...user,
      password: bcrypt.hashSync(user.password, 1)
 }))
   return db.into('users').insert(preppedUsers)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      )
  }


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

function makeGalleriesArray(users){
  return [
    {
      id: 1,
      name: "GalleryOne",
      user_id: users[0].id
    },
    {
      id: 2,
      name: "GalleryTwo",
      user_id: users[1].id
    },
    {
      id: 3,
      name: "GalleryThree",
      user_id: users[2].id
    }
  ];
}

function makeArtworkArray(users, galleries){
  return [
    {
      id: 1,
      artpiece_image: 'http://placehold.it/500x500',
      title: "ArtOne",
      gallery_id: galleries[0].id,
      uploaded: new Date().toISOString(),
      user_id: users[0].id
    },
    {
      id: 2,
      artpiece_image: 'http://placehold.it/500x500',
      title: "ArtTwo",
      gallery_id: galleries[1].id,
      uploaded: new Date().toISOString(),
      user_id: users[1].id
    },
    {
      id: 3,
      artpiece_image: 'http://placehold.it/500x500',
      title: "ArtThree",
      gallery_id: galleries[2].id,
      uploaded: new Date().toISOString(),
      user_id: users[2].id
    },
    {
      id: 4,
      artpiece_image: 'http://placehold.it/500x500',
      title: "ArtFour",
      gallery_id: galleries[0].id,
      uploaded: new Date().toISOString(),
      user_id: users[0].id
    }
  
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

function makeMaliciousArtpiece() {
  const maliciousArtpiece = {
    id: 911,
    artpiece_image: 'malicious.png',
    title: 'Malicious Artpiece <script>alert("xss");</script>',    
    gallery_id: 1,
    uploaded: new Date().toISOString(),
    user_id: 1
   
  };
  const expectedArtpiece = {
    ...maliciousArtpiece,
    title: 'Malicious Artpiece &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    
  };
  return {
    maliciousArtpiece,
    expectedArtpiece,
  };
}


function seedMaliciousArtpiece(db, user, gallery, artpiece) {
  return seedAllTables(db, [user], [gallery])    
    .then(() =>
      db
        .into('artwork')
        .insert([artpiece])
    )
}


function seedMaliciousGallery(db, user, gallery) {
  return seedUsers(db, [user])    
    .then(() =>
      db
        .into('galleries')
        .insert([gallery])
    )
}

module.exports = { 
  makeMaliciousGallery,
  seedMaliciousGallery,
  makeMaliciousArtpiece,
  seedMaliciousArtpiece, 
  makeGalleriesArray, 
  seedUsers, 
  makeAuthHeader,
  makeAllFixtures,
  seedAllTables, 
  makeExpectedGallery, 
  cleanTables,
  makeUsersArray
};







