const express = require('express');
const router = express.Router();

const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

const {
  createItemValidation,
  updateItemValidation,
  itemIdValidation,
  queryValidation,
  handleValidationErrors
} = require('../middleware/validation');

/**
 * Routes for item CRUD operations
 */

// GET /api/items - Get all items with optional filtering and pagination
router.get('/', 
  queryValidation,
  handleValidationErrors,
  getItems
);

// GET /api/items/:id - Get specific item by ID
router.get('/:id',
  itemIdValidation,
  handleValidationErrors,
  getItemById
);

// POST /api/items - Create new item
router.post('/',
  createItemValidation,
  handleValidationErrors,
  createItem
);

// PUT /api/items/:id - Update existing item
router.put('/:id',
  updateItemValidation,
  handleValidationErrors,
  updateItem
);

// DELETE /api/items/:id - Delete item
router.delete('/:id',
  itemIdValidation,
  handleValidationErrors,
  deleteItem
);

module.exports = router;