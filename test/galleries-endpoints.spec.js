const knex = require('knex');
const testFixtures = require('./test-fixtures');
const app = require('../src/app');

describe('Galleries Endpoints', () => {
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

  describe('GET /api/galleries', () => {

    context(`Given no galleries`, () => {
      beforeEach('insert users', () => ( 
        testFixtures.seedUsers(
          db,
          testUsers,        
        ))
      )
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/galleries')
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))              
          .expect(200, []);
      });
    });

    context('Given there are galleries in the database', () => {
     
      beforeEach('insert galleries', () =>  
        testFixtures.seedAllTables(
          db,
          testUsers,
          testGalleries,
          testArtwork
        )
      )

      it('gets the galleries from the store based on user id', () => {      
        
        return supertest(app)
          .get('/api/galleries')
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))          
          .expect(200)
          .expect(res => 
            db
              .from('galleries')
              .select('*')
              .where({'user_id': res.body.id})
          )          
      });
    });

    context(`Given an XSS attack gallery`, () => {
      const testUser = testUsers[0]
      const { maliciousGallery, expectedGallery } = testFixtures.makeMaliciousGallery();

        beforeEach('insert malicious gallery', () => {
        return testFixtures.seedMaliciousGallery(
          db,
          testUser,
          maliciousGallery,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/galleries`) 
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))           
          .expect(200)
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedGallery.name);           
          });
      });
    });
  });
  describe('GET /api/galleries/:id', () => {
    context(`Given no galleries`, () => {
      beforeEach('insert users', () => ( 
        testFixtures.seedUsers(
          db,
          testUsers,        
        ))
      )
      it(`responds 404 whe galleries doesn't exist`, () => {
        return supertest(app)
          .get(`/api/galleries/123`) 
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))         
          .expect(404, {
            error: { message: `Gallery Not Found` }
          });
      });
    });

    context('Given there are galleries in the database', () => {      
      beforeEach('insert galleries', () =>  
        testFixtures.seedAllTables(
          db,
          testUsers,
          testGalleries,
          testArtwork
        )
      )
      it('responds with 200 and the specified gallery', () => {      
        const galleryId = 1;
        const expectedGallery = testGalleries[galleryId - 1];
        return supertest(app)
          .get(`/api/galleries/${galleryId}`)
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))                 
          .expect(200, expectedGallery);
      });
    });

    context(`Given an XSS attack gallery`, () => {      
      const testUser = testUsers[0]
      const { maliciousGallery, expectedGallery } = testFixtures.makeMaliciousGallery();

        beforeEach('insert malicious gallery', () => {
        return testFixtures.seedMaliciousGallery(
          db,
          testUser,
          maliciousGallery,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/galleries/${maliciousGallery.id}`) 
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))           
          .expect(200)
          .expect(res => {
            expect(res.body.name).to.eql(expectedGallery.name);           
          });
      });
    });  
     
  });

  describe('DELETE /api/galleries/:id', () => {
    context(`Given no galleries`, () => {
      beforeEach('insert users', () => ( 
        testFixtures.seedUsers(
          db,
          testUsers,        
        ))
      )
      it(`responds 404 whe gallery doesn't exist`, () => {
        return supertest(app)
          .delete(`/api/galleries/123`)
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))              
          .expect(404, {
            error: { message: `Gallery Not Found` }
          });
      });
    });

    context('Given there are galleries in the database', () => {
    
      beforeEach('insert galleries', () =>   
      testFixtures.seedAllTables(
        db,
        testUsers,
        testGalleries,
        testArtwork
      )
    )
      it('removes the gallery by ID from the store', () => {    
        const idToRemove = 2;        
        return supertest(app)
          .delete(`/api/galleries/${idToRemove}`)
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[1]))             
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/api/galleries`)
              .set('Authorization', testFixtures.makeAuthHeader(testUsers[1]))                
              .expect(res => 
                db
                  .from('galleries')
                  .select('*')
                  .where({'user_id': res.body.id})
              )   
          );
      }); 
    });
  })
  describe('POST /api/galleries', () => {
    context('Given there are users in the database', () => {
    beforeEach('insert users', () => ( 
      testFixtures.seedUsers(
        db,
        testUsers,        
      ))
    )
    const requiredFields = ['name']
    requiredFields.forEach(field => {
      const newGallery = {
        name: 'test-name',
            
      };
    

      it(`responds with 400 missing '${field}' if not supplied`, () => {
     
        delete newGallery[field];

        return supertest(app)
          .post(`/api/galleries`)
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))      
          .send(newGallery)          
          .expect(400, {
            error: { message: `gallery '${field}' is required` }
          });
      });
    });    

    it('adds a new gallery to the store', () => {
      const newGallery = {
        name: 'test-name',        
      };
      return supertest(app)
        .post(`/api/galleries`)
        .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))    
        .send(newGallery)        
        .expect(201)
        .expect(res => {
          expect(res.body.name).to.eql(newGallery.name);        
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('user_id');
          expect(res.headers.location).to.eql(`/api/galleries/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/galleries/${res.body.id}`) 
            .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))               
            .expect(res.body)
        );
    });
  })
    context(`Given an XSS attack gallery`, () => {      
      const testUser = testUsers[0]
      const { maliciousGallery, expectedGallery } = testFixtures.makeMaliciousGallery();

        beforeEach('insert malicious gallery', () => {
        return testFixtures.seedMaliciousGallery(
          db,
          testUser,
          maliciousGallery,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .post(`/api/galleries/`) 
          .set('Authorization', testFixtures.makeAuthHeader(testUser)) 
          .send(maliciousGallery)          
          .expect(201)
          .expect(res => {
            expect(res.body.name).to.eql(expectedGallery.name);           
          });
      });
    });  
  });
  describe(`PATCH /api/galleries/:id`, () => {
    context(`Given no galleries`, () => {
      beforeEach('insert users', () => ( 
        testFixtures.seedUsers(
          db,
          testUsers,        
        ))
      )
      it(`responds with 404`, () => {
        const galleryId = 123456;
        return supertest(app)
          .patch(`/api/galleries/${galleryId}`)
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))             
          .expect(404, { error: { message: `Gallery Not Found` } });
      });
    });
    context('Given there are galleries in the database', () => {
      beforeEach('insert galleries', () =>  
      testFixtures.seedAllTables(
        db,
        testUsers,
        testGalleries,
        testArtwork
      )
    )
      it('responds with 204 and updates the gallery', () => {
        const idToUpdate = 1;
        const updateGallery = {
          name: 'updated gallery name',          
        };
        const expectedGallery = {
          ...testGalleries[idToUpdate - 1],
          ...updateGallery
        };
        return supertest(app)
          .patch(`/api/galleries/${idToUpdate}`)  
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))          
          .send(updateGallery)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/galleries/${idToUpdate}`)
              .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))                
              .expect(expectedGallery)
          );
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 1;
        return supertest(app)
          .patch(`/api/galleries/${idToUpdate}`) 
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))           
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain name`
            }
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 1;
        const updateGallery = {
          name: 'updated gallery name',
        };
        const expectedGallery = {
          ...testGalleries[idToUpdate - 1],
          ...updateGallery
        };

        return supertest(app)
          .patch(`/api/galleries/${idToUpdate}`)  
          .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))          
          .send({
            ...updateGallery,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/galleries/${idToUpdate}`) 
              .set('Authorization', testFixtures.makeAuthHeader(testUsers[0]))              
              .expect(expectedGallery)
          );

      });
    });

  }); 
  
})