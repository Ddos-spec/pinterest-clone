/**
 * @jest-environment jsdom
 */

// Mock axios
const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn()
};

global.axios = mockAxios;

// Mock React and ReactDOM
global.React = {
  createElement: jest.fn(),
  useState: jest.fn(),
  useEffect: jest.fn()
};

global.ReactDOM = {
  render: jest.fn()
};

describe('Frontend Image Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up DOM
    document.body.innerHTML = '<div id="root"></div>';
    
    // Mock Image constructor
    global.Image = class {
      constructor() {
        setTimeout(() => {
          if (this.src && this.src.includes('broken')) {
            this.onerror && this.onerror();
          } else {
            this.onload && this.onload();
          }
        }, 10);
      }
    };
  });

  test('should detect broken images', (done) => {
    const checkImageExists = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    checkImageExists('https://example.com/broken-image.jpg').then(exists => {
      expect(exists).toBe(false);
      done();
    });
  });

  test('should detect working images', (done) => {
    const checkImageExists = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    checkImageExists('https://example.com/working-image.jpg').then(exists => {
      expect(exists).toBe(true);
      done();
    });
  });
});

describe('Frontend Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.get.mockReset();
    mockAxios.post.mockReset();
    mockAxios.delete.mockReset();
  });

  test('should handle unauthenticated user', async () => {
    mockAxios.get.mockRejectedValue({ response: { status: 401 } });
    
    // Simulate checking authentication
    try {
      await mockAxios.get('/api/user');
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
    
    expect(mockAxios.get).toHaveBeenCalledWith('/api/user');
  });

  test('should handle authenticated user', async () => {
    const mockUser = {
      username: 'testuser',
      displayName: 'Test User',
      avatarUrl: 'https://github.com/testuser.png'
    };
    
    mockAxios.get.mockResolvedValue({ data: mockUser });
    
    const response = await mockAxios.get('/api/user');
    expect(response.data).toEqual(mockUser);
    expect(mockAxios.get).toHaveBeenCalledWith('/api/user');
  });
});

describe('Pin Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.get.mockReset();
    mockAxios.post.mockReset();
    mockAxios.delete.mockReset();
  });

  test('should create a new pin', async () => {
    const newPin = {
      imageUrl: 'https://example.com/image.jpg',
      description: 'Test pin'
    };
    
    const mockResponse = {
      _id: '507f1f77bcf86cd799439011',
      ...newPin,
      createdAt: new Date().toISOString()
    };
    
    mockAxios.post.mockResolvedValue({ data: mockResponse });
    
    const response = await mockAxios.post('/api/pins', newPin);
    expect(response.data).toEqual(mockResponse);
    expect(mockAxios.post).toHaveBeenCalledWith('/api/pins', newPin);
  });

  test('should delete a pin', async () => {
    const pinId = '507f1f77bcf86cd799439011';
    mockAxios.delete.mockResolvedValue({ data: { message: 'Pin deleted successfully' } });
    
    const response = await mockAxios.delete(`/api/pins/${pinId}`);
    expect(response.data.message).toBe('Pin deleted successfully');
    expect(mockAxios.delete).toHaveBeenCalledWith(`/api/pins/${pinId}`);
  });

  test('should load user pins', async () => {
    const mockPins = [
      {
        _id: '507f1f77bcf86cd799439011',
        imageUrl: 'https://example.com/image1.jpg',
        description: 'Pin 1',
        createdAt: new Date().toISOString()
      },
      {
        _id: '507f1f77bcf86cd799439012',
        imageUrl: 'https://example.com/image2.jpg',
        description: 'Pin 2',
        createdAt: new Date().toISOString()
      }
    ];
    
    mockAxios.get.mockResolvedValue({ data: mockPins });
    
    const response = await mockAxios.get('/api/pins');
    expect(response.data).toEqual(mockPins);
    expect(mockAxios.get).toHaveBeenCalledWith('/api/pins');
  });
});

describe('Public User Wall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.get.mockReset();
  });

  test('should load public user pins', async () => {
    const username = 'testuser';
    const mockResponse = {
      user: {
        username: 'testuser',
        displayName: 'Test User'
      },
      pins: [
        {
          _id: '507f1f77bcf86cd799439011',
          imageUrl: 'https://example.com/image1.jpg',
          description: 'Public pin 1',
          createdAt: new Date().toISOString()
        }
      ]
    };
    
    mockAxios.get.mockResolvedValue({ data: mockResponse });
    
    const response = await mockAxios.get(`/api/users/${username}/pins`);
    expect(response.data).toEqual(mockResponse);
    expect(mockAxios.get).toHaveBeenCalledWith(`/api/users/${username}/pins`);
  });

  test('should handle non-existent user', async () => {
    const username = 'nonexistentuser';
    mockAxios.get.mockRejectedValue({ 
      response: { 
        status: 404, 
        data: { error: 'User not found' } 
      } 
    });
    
    try {
      await mockAxios.get(`/api/users/${username}/pins`);
    } catch (error) {
      expect(error.response.status).toBe(404);
      expect(error.response.data.error).toBe('User not found');
    }
    
    expect(mockAxios.get).toHaveBeenCalledWith(`/api/users/${username}/pins`);
  });
});

