const app = require('../src/app');

describe('App', () => {
  it('GET / responds with 200 containing brief message', () => {
    return supertest(app)
      .get('/')
      .expect(200,  `Welcome to L'Artiste Server! There are two top level endpoints /api/galleries and /api/artwork. Check out the full documentation at: https://github.com/thinkful-ei-emu/ashley-capstone-server` );
  });
});