const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')


const user = {username: 'daxz', password: '1234'}
let token;

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});


afterAll(async () => {
  await db.destroy();
});

describe('Registration and Login Endpoints', () => {
  describe('Registration', () => {
    it('should register a new user', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send(user);
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.username).toBe(user.username);
    });

    it('should return an error if username is taken', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send(user);
      expect(response.status).toBe(500); // or 400 depending on your implementation
      expect(response.body.message).toBe('username taken');
    });
  });

  describe('Login', () => {
    it('should log in with valid credentials', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send(user);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('welcome, daxz');
      expect(response.body.token).toBeDefined();
      token = response.body.token;
    });

    it('should return an error if credentials are invalid', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({ username: 'invalid', password: 'invalid' });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('invalid credentials');
    });

  });
});

describe('Jokes Endpoint', () => {
  it('should get jokes with a valid token', async () => {
    const response = await request(server)
      .get('/api/jokes')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    // Add assertions for the response body as needed
    expect(response.body).toBeInstanceOf(Array); // Assert that the response is an array of jokes
    expect(response.body.length).toBeGreaterThan(0); // Assert that at least one joke is returned
  });

  it('should return an error if token is missing', async () => {
    const response = await request(server).get('/api/jokes');
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('token required');
  });
});