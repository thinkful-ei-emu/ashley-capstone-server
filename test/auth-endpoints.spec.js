const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const testFixtures= require('./test-fixtures');

describe.only('Auth Endpoints', function() {
  let db;

  const {testUsers} = testFixtures.makeAllFixtures();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex ({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => testFixtures.cleanTables(db));

  afterEach('cleanup', () => testFixtures.cleanTables(db));

  describe('POST /api/auth/login', () => {
    beforeEach('insert users', () =>
      testFixtures.seedUsers(
        db,
        testUsers
      )
    );
    const requiredFields = ['user_name', 'password'];

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        user : {
          user_name: testUser.user_name,
          password: testUser.password
        }
        }

      
      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody.user[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`
          });
      });
    });
    it('responds 400 \'invalid user_name or password\' when bad user_name', () => {
      const userInvalidUser = {user: {user_name: 'user-not', password: 'existy'}};
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidUser)
        .expect(400, {error: 'Incorrect user name'}
        );
    });
    it('responds 400 \'invalid user_name or password\' when bad password', () => {
      const userInvalidPass = {user: {user_name: testUser.user_name, password: 'incorrect'}};
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidPass)
        .expect(400, {error: 'Incorrect password'}
        );
    });

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
       user: {
         user_name: testUser.user_name,
          password: testUser.password,
      } 
      };
      const expectedToken = jwt.sign(
        {user_id: testUser.id }, // payload
        process.env.JWT_SECRET,
        {
          subject: testUser.user_name,
          expiresIn: '5h',
          algorithm: 'HS256',
        }
      );
      return supertest(app)
        .post('/api/auth/login')
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
        });
    });

  });  
});