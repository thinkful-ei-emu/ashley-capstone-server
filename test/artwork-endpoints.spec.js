const knex = require('knex');
const testFixtures = require('./test-fixtures');
const app = require('../src/app');

describe('Artwork Endpoints', () => {
  let db;

  const {
    testUsers,
    testGalleries,
    testArtwork,
  } = testFixtures.makeAllFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => testFixtures.cleanTables(db)) ;

  afterEach('cleanup', () => testFixtures.cleanTables(db));

  describe('GET /api/artwork', () => {

    context(`Given no artwork`, () => {
      beforeEach('insert users and galleries', () =>  
      testFixtures.seedAllTables(
        db,
        testUsers,
        testGalleries,        
      )
    )
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/artwork')
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))              
          .expect(200, []);
      });
    });

    context('Given there is artwork in the database', () => {
     
      beforeEach('insert all tables', () =>  
        testFixtures.seedAllTables(
          db,
          testUsers,
          testGalleries,
          testArtwork
        )
      )

      it('gets the artwork from the store based on user id', () => {      
        
        return supertest(app)
          .get('/api/artwork')
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))          
          .expect(200)
          .expect(res => 
            db
              .from('artwork')
              .select('*')
              .where({'user_id': res.body.id})
          )                   
      });
    });

    context(`Given an XSS attack artwork`, () => {
      const testUser = testUsers[0]
      const testGallery = testGalleries[0]
      const { maliciousArtpiece, expectedArtpiece } = testFixtures.makeMaliciousArtpiece();

        beforeEach('insert malicious artpiece', () => {
        return testFixtures.seedMaliciousArtpiece(
          db,
          testUser,
          testGallery,
          maliciousArtpiece,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/artwork`) 
          .set('Authorization', testFixtures.makeAuthHeader(testUser))           
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedArtpiece.title);           
          });
      });
    });
  });
  describe('GET /api/artwork/:id', () => {
    context(`Given no artwork`, () => {
      beforeEach('insert users and galleries', () =>  
      testFixtures.seedAllTables(
        db,
        testUsers,
        testGalleries,        
      )
    )
      it(`responds 404 whe artwork doesn't exist`, () => {
        return supertest(app)
          .get(`/api/artwork/123`) 
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))         
          .expect(404, {
            error: { message: `artpiece Not Found` }
          });
      });
    });

    context('Given there are artwork in the database', () => {      
      beforeEach('insert all tables', () =>  
      testFixtures.seedAllTables(
        db,
        testUsers,
        testGalleries,
        testArtwork
      )
    )
      it('responds with 200 and the specified artpiece', () => {      
        const artpieceId = 1;
        const expectedArtpiece = testArtwork[artpieceId - 1];
        return supertest(app)
          .get(`/api/artwork/${artpieceId}`)
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))                 
          .expect(200, expectedArtpiece);
      });
    });
    context(`Given an XSS attack artwork`, () => {
      const testUser = testUsers[0]
      const testGallery = testGalleries[0]
      const { maliciousArtpiece, expectedArtpiece } = testFixtures.makeMaliciousArtpiece();

        beforeEach('insert malicious artpiece', () => {
          return testFixtures.seedMaliciousArtpiece(
            db,
            testUser,
            testGallery,
            maliciousArtpiece,
          )
      })
      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/artwork/${maliciousArtpiece.id}`) 
          .set('Authorization', testFixtures.makeAuthHeader(testUser))           
          .expect(200)
          .expect(res => {         
            expect(res.body.title).to.eql(expectedArtpiece.title);           
          });
      });
    }); 
     
  });

  describe('DELETE /api/artwork/:id', () => {
    context(`Given no artwork`, () => {
        beforeEach('insert users and galleries', () =>  
          testFixtures.seedAllTables(
            db,
            testUsers,
            testGalleries,        
          )
      )
      it(`responds 404 whe artpiece doesn't exist`, () => {
        return supertest(app)
          .delete(`/api/artwork/123`)
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))              
          .expect(404, {
            error: { message: `artpiece Not Found` }
          });
      });
    });

    context('Given there is artwork in the database', () => {
    
        beforeEach('insert all tables', () =>  
          testFixtures.seedAllTables(
            db,
            testUsers,
            testGalleries,
            testArtwork
          )
      )
      it('removes the artpiece by ID from the store', () => {    
        const idToRemove = 1;      
        return supertest(app)
          .delete(`/api/artwork/${idToRemove}`)
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))             
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/api/artwork`)
              .set('Authorization', testFixtures.makeAuthHeader(testUsers[1]))                
              .expect(res => 
                db
                  .from('artwork')
                  .select('*')
                  .where({'user_id': res.body.id})           
              )   
          );
      }); 
    });
  })
  describe('POST /api/arwork', () => {
    context('Given there are users and galleries in the database', () => {
        beforeEach('insert users and galleries', () =>  
          testFixtures.seedAllTables(
            db,
            testUsers,
            testGalleries,        
          )
      )
      const requiredFields = ['title', 'artpiece_image', 'gallery_id' ]
      requiredFields.forEach(field => {
        const newArtpiece = {
          title: 'test-title',
          artpiece_image: 'test.png',
          gallery_id: 1            
        };
    

      it(`responds with 400 missing '${field}' if not supplied`, () => {
     
        delete newArtpiece[field];

        return supertest(app)
          .post(`/api/artwork`)
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))      
          .send(newArtpiece)          
          .expect(400, {
            error: { message: `'${field}' is required` }
          });
      });
    });    

      it('adds a new artpiece to the store', () => {
        const newArtpiece = {
          title: 'test-title',
          artpiece_image: 'test.png',
          gallery_id: 1            
        };
        return supertest(app)
          .post(`/api/artwork`)
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))    
          .send(newArtpiece)        
          .expect(201)
          .expect(res => {
            expect(res.body.title).to.eql(newArtpiece.title); 
            expect(res.body.artpiece_image).to.eql(newArtpiece.artpiece_image);
            expect(res.body.gallery_id).to.eql(newArtpiece.gallery_id);         
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('user_id');
            expect(res.headers.location).to.eql(`/api/artwork/${res.body.id}`);
          })
          .then(res =>
            supertest(app)
              .get(`/api/artwork/${res.body.id}`) 
              .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))               
              .expect(res.body)
          );
      });
      it(`responds with 400 invalid 'gallery_id' if not a number`, () => {   
        const updateInvalidId = {
          title: 'test-title',
          artpiece_image: 'test.png',
          gallery_id: 'invalid',
        };
        return supertest(app)
          .post(`/api/artwork`)
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))             
          .send(updateInvalidId)
          .expect(400, {
            error: {
              message: "A valid 'gallery_id' is required"
            }
          });
      });
    })
    context(`Given an XSS attack artwork`, () => {
      const testUser = testUsers[0]
      const testGallery = testGalleries[0]
      const { maliciousArtpiece, expectedArtpiece } = testFixtures.makeMaliciousArtpiece();

        beforeEach('insert malicious artpiece', () => {
          return testFixtures.seedMaliciousArtpiece(
            db,
            testUser,
            testGallery,
            maliciousArtpiece,
          )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .post(`/api/artwork`) 
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))
          .send(maliciousArtpiece)           
          .expect(201)
          .expect(res => {           
            expect(res.body.title).to.eql(expectedArtpiece.title);           
          });
      });
    });
     
  });
      
  describe(`PATCH /api/artwork/:id`, () => {
    context(`Given no artwork`, () => {
      beforeEach('insert users and galleries', () =>  
      testFixtures.seedAllTables(
        db,
        testUsers,
        testGalleries,        
      )
    )
      it(`responds with 404`, () => {
        const artpieceId = 123456;
        return supertest(app)
          .patch(`/api/artwork/${artpieceId}`)
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))             
          .expect(404, { error: { message: `artpiece Not Found` } });
      });
    });
    context('Given there is artwork in the database', () => {
      beforeEach('insert all tables', () =>  
      testFixtures.seedAllTables(
        db,
        testUsers,
        testGalleries,
        testArtwork
      )
    )
      it('responds with 204 and updates the artpiece', () => {
        const idToUpdate = 1;
        const updateArtpiece = {
          title: 'updated artpiece title',
          artpiece_image: 'updateTest.png',
          gallery_id: 1            
        };
        const expectedArtpiece = {
          ...testArtwork[idToUpdate - 1],
          ...updateArtpiece
        };
        return supertest(app)
          .patch(`/api/artwork/${idToUpdate}`)  
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))          
          .send(updateArtpiece)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/artwork/${idToUpdate}`)
              .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))                
              .expect(expectedArtpiece)
          );
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 1;
        return supertest(app)
          .patch(`/api/artwork/${idToUpdate}`) 
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))           
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain either "title" or "artpiece_image"`
            }
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 1;
        const updateArtpiece = {
          title: 'updated artpiece title',
        };
        const expectedArtpiece = {
          ...testArtwork[idToUpdate - 1],
          ...updateArtpiece
        };

        return supertest(app)
          .patch(`/api/artwork/${idToUpdate}`)  
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))          
          .send({
            ...updateArtpiece,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/artwork/${idToUpdate}`) 
              .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))              
              .expect(expectedArtpiece)
          );

      });

     
    });

  }); 
  
})