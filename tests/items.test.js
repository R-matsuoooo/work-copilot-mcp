const request = require('supertest');
const fs = require('fs').promises;
const path = require('path');
const app = require('../src/server');

// Test data file path
const testDataPath = path.join(__dirname, '../data/items.json');

// Helper function to reset test data
const resetTestData = async () => {
  const initialData = {
    items: [],
    metadata: {
      lastUpdated: new Date().toISOString(),
      version: 1
    }
  };
  await fs.writeFile(testDataPath, JSON.stringify(initialData, null, 2));
};

describe('Items API', () => {
  beforeEach(async () => {
    await resetTestData();
  });

  describe('GET /api/items', () => {
    it('should return empty array when no items exist', async () => {
      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toEqual([]);
      expect(response.body.data.pagination.total).toBe(0);
    });

    it('should return items with pagination', async () => {
      // First create some items
      const item1 = {
        title: 'Test Item 1',
        description: 'Description 1',
        priority: 'high'
      };

      const item2 = {
        title: 'Test Item 2',
        description: 'Description 2',
        priority: 'low'
      };

      await request(app).post('/api/items').send(item1);
      await request(app).post('/api/items').send(item2);

      const response = await request(app)
        .get('/api/items?page=1&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.pagination.total).toBe(2);
      expect(response.body.data.pagination.totalPages).toBe(2);
    });

    it('should filter by status', async () => {
      const item = {
        title: 'Test Item',
        description: 'Description',
        status: 'inactive'
      };

      await request(app).post('/api/items').send(item);

      const response = await request(app)
        .get('/api/items?status=inactive')
        .expect(200);

      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].status).toBe('inactive');
    });

    it('should search by title and description', async () => {
      const item1 = {
        title: 'JavaScript Tutorial',
        description: 'Learn React'
      };

      const item2 = {
        title: 'Python Guide',
        description: 'Learn Django'
      };

      await request(app).post('/api/items').send(item1);
      await request(app).post('/api/items').send(item2);

      const response = await request(app)
        .get('/api/items?search=JavaScript')
        .expect(200);

      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].title).toBe('JavaScript Tutorial');
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return a specific item by ID', async () => {
      const newItem = {
        title: 'Test Item',
        description: 'Test Description'
      };

      const createResponse = await request(app)
        .post('/api/items')
        .send(newItem);

      const itemId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/items/${itemId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(itemId);
      expect(response.body.data.title).toBe('Test Item');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .get('/api/items/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ITEM_NOT_FOUND');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      const newItem = {
        title: 'New Test Item',
        description: 'Test Description',
        priority: 'high',
        tags: ['test', 'api']
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('New Test Item');
      expect(response.body.data.priority).toBe('high');
      expect(response.body.data.tags).toEqual(['test', 'api']);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });

    it('should set default values', async () => {
      const newItem = {
        title: 'Minimal Item'
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .expect(201);

      expect(response.body.data.status).toBe('active');
      expect(response.body.data.priority).toBe('medium');
      expect(response.body.data.tags).toEqual([]);
      expect(response.body.data.description).toBe('');
    });

    it('should return validation error for missing title', async () => {
      const newItem = {
        description: 'No title provided'
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'title',
            message: expect.stringContaining('required')
          })
        ])
      );
    });

    it('should return validation error for invalid priority', async () => {
      const newItem = {
        title: 'Test Item',
        priority: 'invalid'
      };

      const response = await request(app)
        .post('/api/items')
        .send(newItem)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update an existing item', async () => {
      // Create an item first
      const newItem = {
        title: 'Original Title',
        description: 'Original Description'
      };

      const createResponse = await request(app)
        .post('/api/items')
        .send(newItem);

      const itemId = createResponse.body.data.id;

      // Update the item
      const updates = {
        title: 'Updated Title',
        status: 'inactive',
        priority: 'high'
      };

      const response = await request(app)
        .put(`/api/items/${itemId}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.status).toBe('inactive');
      expect(response.body.data.priority).toBe('high');
      expect(response.body.data.description).toBe('Original Description'); // Should remain unchanged
    });

    it('should return 404 for non-existent item', async () => {
      const updates = {
        title: 'Updated Title'
      };

      const response = await request(app)
        .put('/api/items/non-existent-id')
        .send(updates)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ITEM_NOT_FOUND');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an existing item', async () => {
      // Create an item first
      const newItem = {
        title: 'Item to Delete',
        description: 'This will be deleted'
      };

      const createResponse = await request(app)
        .post('/api/items')
        .send(newItem);

      const itemId = createResponse.body.data.id;

      // Delete the item
      const response = await request(app)
        .delete(`/api/items/${itemId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Item deleted successfully');

      // Verify item is deleted
      await request(app)
        .get(`/api/items/${itemId}`)
        .expect(404);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .delete('/api/items/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ITEM_NOT_FOUND');
    });
  });

  describe('Health Check', () => {
    it('should return server status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
      expect(response.body.timestamp).toBeDefined();
    });
  });
});