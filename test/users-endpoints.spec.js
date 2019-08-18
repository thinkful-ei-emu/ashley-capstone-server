const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const testFixtures = require('./test-fixtures');

describe.only('Users Endpoints', function() {
  let db;

  const { testUsers } = testFixtures.makeAllFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => testFixtures.cleanTables(db));

  afterEach('cleanup', () => testFixtures.cleanTables(db));

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        testFixtures.seedUsers(
          db,
          testUsers
        )
      );

      const requiredFields = ['first_name', 'last_name', 'user_name', 'password', 'email'];

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: 'test password',         
          email: 'test@test.com',
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            });
        });
      });
      it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
        const userShortPassword = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: '1234567',      
          email: 'test@test.com',
        };
        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: `Password be longer than 8 characters` });
      });
  
      it(`responds 400 'Password be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: '*'.repeat(73),        
          email: 'test@test.com',
        };    
        return supertest(app)
          .post('/api/users')
          .send(userLongPassword)
          .expect(400, { error: `Password be less than 72 characters` });
      });
      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: ' 1Aa!2Bb@',        
          email: 'test@test.com',
        };
        return supertest(app)
          .post('/api/users')
          .send(userPasswordStartsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` });
      });
      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: '1Aa!2Bb@ ',       
          email: 'test@test.com',
        };
        return supertest(app)
          .post('/api/users')
          .send(userPasswordEndsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` });
      });
      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: '11AAaabb',    
          email: 'test@test.com',
        };
        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` });
      });
      it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
        const duplicateUser = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: testUser.user_name,
          password: '11AAaa!!',        
          email: 'test@test.com',
        };
        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, { error: `Username already taken` });
      });
      it(`responds 400 'Email already taken' when email isn't unique`, () => {
        const duplicateEmail = {
          first_name: 'test first_name',
          last_name: 'test last_name',
          user_name: 'test user_name',
          password: '11AAaa!!',        
          email: testUser.email,
        };
        return supertest(app)
          .post('/api/users')
          .send(duplicateEmail)
          .expect(400, { error: `Email already taken` });
      });
  
    });
    
    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          first_name: 'test2 first_name',
          last_name: 'test2 last_name',
          user_name: 'test2 user_name',
          password: '11AAaa!!',        
          email: 'test2@test.com',
        };
        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {           
            expect(res.body).to.have.property('id');
            expect(res.body.user_name).to.eql(newUser.user_name);
            expect(res.body.first_name).to.eql(newUser.first_name);
            expect(res.body.last_name).to.eql(newUser.last_name); 
            expect(res.body.email).to.eql(newUser.email);    
            expect(res.body).to.not.have.property('password');
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
        
       
          })
          .expect(res =>
            db
              .from('users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.user_name).to.eql(newUser.user_name);
                expect(row.first_name).to.eql(newUser.first_name);
                expect(row.last_name).to.eql(newUser.last_name);                
                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true;
              })            
          );
      });
    });
  });
});