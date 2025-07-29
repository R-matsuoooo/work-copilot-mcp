const request = require('supertest');
const fs = require('fs').promises;
const path = require('path');
const app = require('../src/server');

const TEST_DATA_FILE = path.join(__dirname, '../data/items.json');

describe('Items API', () => {
  let testItemId;

  beforeEach(async () => {
    // Reset test data before each test
    const testData = {
      items: [],
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: 1
      }
    };
    await fs.writeFile(TEST_DATA_FILE, JSON.stringify(testData, null, 2));
  });

  afterAll(async () => {
    // Clean up test data
    try {
      await fs.unlink(TEST_DATA_FILE);
    } catch (error) {
      // File might not exist, ignore error
    }
  });

  describe('POST /api/items', () => {
    it('should create a new item with valid data', async () => {
      const newItem = {
        title: 'Test Item',
        description: 'Test description',
        priority: 'high',
        tags: ['test', 'api']
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        title: newItem.title,
        description: newItem.description,
        priority: newItem.priority,
        tags: newItem.tags,
        status: 'active' // default value
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();

      testItemId = response.body.data.id;
    });

    it('should return 400 if title is missing', async () => {
      const invalidItem = {
        description: 'Test description'
      };

      const response = await request(app)
        .post('/api/items')
        .send(invalidItem)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: expect.stringContaining('Title is required')
          })
        ])
      );
    });

    it('should return 400 if title is too long', async () => {
      const invalidItem = {
        title: 'a'.repeat(101) // 101 characters, exceeds limit
      };

      const response = await request(app)
        .post('/api/items')
        .send(invalidItem)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 if priority is invalid', async () => {
      const invalidItem = {
        title: 'Test Item',
        priority: 'invalid'
      };

      const response = await request(app)
        .post('/api/items')
        .send(invalidItem)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/items', () => {
    beforeEach(async () => {
      // Create test items
      const testItems = [
        {
          title: 'Item 1',
          description: 'First item',
          status: 'active',
          priority: 'high',
          tags: ['tag1']
        },
        {
          title: 'Item 2',
          description: 'Second item',
          status: 'inactive',
          priority: 'low',
          tags: ['tag2']
        },
        {
          title: 'Search Item',
          description: 'Item for search testing',
          status: 'active',
          priority: 'medium',
          tags: ['search']
        }
      ];

      for (const item of testItems) {
        await request(app).post('/api/items').send(item);
      }
    });

    it('should get all items with pagination', async () => {
      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(3);
      expect(response.body.data.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1
      });
    });

    it('should filter items by status', async () => {
      const response = await request(app)
        .get('/api/items?status=active')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.items.every(item => item.status === 'active')).toBe(true);
    });

    it('should filter items by priority', async () => {
      const response = await request(app)
        .get('/api/items?priority=high')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].priority).toBe('high');
    });

    it('should search items by title', async () => {
      const response = await request(app)
        .get('/api/items?search=Search')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].title).toBe('Search Item');
    });

    it('should search items by description', async () => {
      const response = await request(app)
        .get('/api/items?search=testing')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].description).toContain('testing');
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/items?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.pagination).toMatchObject({
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2
      });
    });
  });

  describe('GET /api/items/:id', () => {
    beforeEach(async () => {
      const newItem = {
        title: 'Test Item',
        description: 'Test description'
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem);
      
      testItemId = response.body.data.id;
    });

    it('should get item by valid ID', async () => {
      const response = await request(app)
        .get(`/api/items/${testItemId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testItemId);
      expect(response.body.data.title).toBe('Test Item');
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      const response = await request(app)
        .get(`/api/items/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ITEM_NOT_FOUND');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/items/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PUT /api/items/:id', () => {
    beforeEach(async () => {
      const newItem = {
        title: 'Original Title',
        description: 'Original description'
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem);
      
      testItemId = response.body.data.id;
    });

    it('should update item with valid data', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated description',
        status: 'inactive',
        priority: 'high'
      };

      const response = await request(app)
        .put(`/api/items/${testItemId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.description).toBe('Updated description');
      expect(response.body.data.status).toBe('inactive');
      expect(response.body.data.priority).toBe('high');
      expect(response.body.data.updatedAt).not.toBe(response.body.data.createdAt);
    });

    it('should update only provided fields', async () => {
      const updateData = {
        title: 'New Title Only'
      };

      const response = await request(app)
        .put(`/api/items/${testItemId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('New Title Only');
      expect(response.body.data.description).toBe('Original description'); // unchanged
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = { title: 'Updated Title' };

      const response = await request(app)
        .put(`/api/items/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ITEM_NOT_FOUND');
    });

    it('should return 400 for invalid update data', async () => {
      const invalidData = {
        status: 'invalid-status'
      };

      const response = await request(app)
        .put(`/api/items/${testItemId}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('DELETE /api/items/:id', () => {
    beforeEach(async () => {
      const newItem = {
        title: 'Item to Delete',
        description: 'This item will be deleted'
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem);
      
      testItemId = response.body.data.id;
    });

    it('should delete item with valid ID', async () => {
      const response = await request(app)
        .delete(`/api/items/${testItemId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Item deleted successfully');

      // Verify item is actually deleted
      await request(app)
        .get(`/api/items/${testItemId}`)
        .expect(404);
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';

      const response = await request(app)
        .delete(`/api/items/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ITEM_NOT_FOUND');
    });
  });

  describe('Health Check', () => {
    it('should return server health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});