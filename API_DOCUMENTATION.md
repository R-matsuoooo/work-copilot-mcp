# CRUD Backend Server API Documentation

## Overview
A simple CRUD backend server built with Express.js and JSON file storage. This API provides complete Create, Read, Update, Delete operations for managing items.

## Base URL
```
http://localhost:3000
```

## Data Model

### Item Structure
```json
{
  "id": "string (UUID v4)",
  "title": "string (1-100 chars, required)",
  "description": "string (max 500 chars, optional)",
  "status": "active|inactive|archived (default: active)",
  "priority": "low|medium|high (default: medium)",
  "tags": ["string array (optional)"],
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status information.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-07-29T05:00:00.000Z"
}
```

### Get All Items
```
GET /api/items
```

**Query Parameters (Optional):**
- `status`: Filter by status (active|inactive|archived)
- `priority`: Filter by priority (low|medium|high)
- `search`: Search in title and description
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Example:**
```
GET /api/items?status=active&page=1&limit=5&search=test
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### Get Item by ID
```
GET /api/items/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Item Title",
    "description": "Item Description",
    "status": "active",
    "priority": "medium",
    "tags": ["tag1", "tag2"],
    "createdAt": "2025-07-29T05:00:00.000Z",
    "updatedAt": "2025-07-29T05:00:00.000Z"
  }
}
```

### Create New Item
```
POST /api/items
```

**Request Body:**
```json
{
  "title": "New Item Title",          // required
  "description": "Item description",  // optional
  "status": "active",                 // optional (default: active)
  "priority": "high",                 // optional (default: medium)
  "tags": ["tag1", "tag2"]           // optional (default: [])
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "title": "New Item Title",
    "description": "Item description",
    "status": "active",
    "priority": "high",
    "tags": ["tag1", "tag2"],
    "createdAt": "2025-07-29T05:00:00.000Z",
    "updatedAt": "2025-07-29T05:00:00.000Z"
  }
}
```

### Update Item
```
PUT /api/items/:id
```

**Request Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "inactive",
  "priority": "low",
  "tags": ["new", "tags"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    // Updated item data
  }
}
```

### Delete Item
```
DELETE /api/items/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  }
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Item with id 'xxx' not found"
  }
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Internal server error"
  }
}
```

## Usage Examples

### Create an item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "description": "Task description",
    "priority": "high",
    "tags": ["work", "urgent"]
  }'
```

### Get all active items
```bash
curl "http://localhost:3000/api/items?status=active"
```

### Update an item
```bash
curl -X PUT http://localhost:3000/api/items/item-id \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Delete an item
```bash
curl -X DELETE http://localhost:3000/api/items/item-id
```

## Development

### Start Server
```bash
npm start          # Production mode
npm run dev        # Development mode with auto-reload
```

### Run Tests
```bash
npm test           # Run all tests
npm run test:watch # Watch mode
```

## Features

- ✅ Complete CRUD operations
- ✅ Input validation with express-validator
- ✅ Pagination and filtering
- ✅ Search functionality
- ✅ JSON file-based persistence
- ✅ Comprehensive error handling
- ✅ Full test suite with Jest + Supertest
- ✅ Security headers with Helmet
- ✅ CORS support
- ✅ Request logging