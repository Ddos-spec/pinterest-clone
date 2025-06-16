const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Mock environment variables
process.env.GITHUB_CLIENT_ID = 'test_client_id';
process.env.GITHUB_CLIENT_SECRET = 'test_client_secret';
process.env.SESSION_SECRET = 'test_session_secret';

let mongoServer;
let app;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  
  // Import app after setting environment variables
  app = require('../src/server/server');
  
  // Wait for MongoDB connection
  await mongoose.connection.once('open', () => {
    console.log('Connected to in-memory MongoDB');
  });
});

afterAll(async () => {
  // Close MongoDB connection and stop server
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Pinterest Clone API', () => {
  describe('Authentication Routes', () => {
    test('GET /auth/github should redirect to GitHub', async () => {
      const response = await request(app)
        .get('/auth/github')
        .expect(302);
      
      expect(response.headers.location).toContain('github.com');
    });

    test('GET /api/user should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/user')
        .expect(401);
      
      expect(response.body.error).toBe('Not authenticated');
    });
  });

  describe('Pin Routes', () => {
    test('POST /api/pins should require authentication', async () => {
      const response = await request(app)
        .post('/api/pins')
        .send({
          imageUrl: 'https://example.com/image.jpg',
          description: 'Test pin'
        })
        .expect(401);
      
      expect(response.body.error).toBe('Authentication required');
    });

    test('GET /api/pins should require authentication', async () => {
      const response = await request(app)
        .get('/api/pins')
        .expect(401);
      
      expect(response.body.error).toBe('Authentication required');
    });

    test('DELETE /api/pins/:id should require authentication', async () => {
      const response = await request(app)
        .delete('/api/pins/507f1f77bcf86cd799439011')
        .expect(401);
      
      expect(response.body.error).toBe('Authentication required');
    });
  });

  describe('Public Routes', () => {
    test('GET /api/users/:username/pins should work without authentication', async () => {
      const response = await request(app)
        .get('/api/users/nonexistentuser/pins')
        .expect(404);
      
      expect(response.body.error).toBe('User not found');
    });

    test('GET / should serve the main page', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toContain('Pinterest Clone');
    });
  });
});

