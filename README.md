# CRUD Backend Server

A simple and efficient CRUD (Create, Read, Update, Delete) backend server built with Express.js and JSON file storage.

## 🚀 Features

- **Complete CRUD Operations**: Create, read, update, and delete items
- **RESTful API**: Clean and intuitive REST endpoints
- **Input Validation**: Comprehensive validation using express-validator
- **Filtering & Search**: Filter by status/priority, search in title/description
- **Pagination**: Efficient pagination for large datasets
- **JSON File Storage**: Lightweight persistence without external dependencies
- **Error Handling**: Unified error response format
- **Security**: CORS and security headers with Helmet
- **Testing**: Comprehensive test suite with Jest + Supertest
- **Auto-reload**: Development mode with nodemon

## 📋 Data Model

Items have the following structure:
- **id**: UUID v4 identifier
- **title**: Required string (1-100 characters)
- **description**: Optional string (max 500 characters)
- **status**: active | inactive | archived (default: active)
- **priority**: low | medium | high (default: medium)
- **tags**: Array of strings (optional)
- **createdAt/updatedAt**: ISO 8601 timestamps

## 🛣️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/items` | Get all items (with filtering/pagination) |
| GET | `/api/items/:id` | Get specific item |
| POST | `/api/items` | Create new item |
| PUT | `/api/items/:id` | Update existing item |
| DELETE | `/api/items/:id` | Delete item |

## 🏃‍♂️ Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev    # Start with auto-reload
```

### Production
```bash
npm start      # Start server
```

### Testing
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## 📖 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation with examples.

## 🏗️ Project Structure

```
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/          # Data models
│   ├── routes/          # Route definitions
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── data/
│   └── items.json       # JSON data storage
├── tests/
│   └── items.test.js    # Test suite
└── API_DOCUMENTATION.md # Detailed API docs
```

## 🧪 Example Usage

### Create an item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "description": "Important task to complete",
    "priority": "high",
    "tags": ["work", "urgent"]
  }'
```

### Get items with filtering
```bash
curl "http://localhost:3000/api/items?status=active&priority=high&page=1&limit=5"
```

### Update an item
```bash
curl -X PUT http://localhost:3000/api/items/item-id \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

## 🔒 Security Features

- CORS configuration
- Security headers via Helmet
- Input validation and sanitization
- Error handling without data leaks

## 📊 Testing

The project includes comprehensive tests covering:
- All CRUD operations
- Input validation
- Error handling
- Pagination and filtering
- Search functionality

Run tests with: `npm test`

## 🤝 Development

The server includes:
- Hot reloading with nodemon
- Comprehensive logging
- Graceful shutdown handling
- Environment-based configuration

## 📝 License

This project is licensed under the ISC License.