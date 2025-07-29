const express = require('express');
const ItemController = require('../controllers/itemController');
const {
  createItemValidation,
  updateItemValidation,
  idParamValidation,
  listItemsValidation,
  handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

// GET /api/items - Get all items with filtering and pagination
router.get(
  '/',
  listItemsValidation,
  handleValidationErrors,
  ItemController.getAllItems
);

// GET /api/items/:id - Get item by ID
router.get(
  '/:id',
  idParamValidation,
  handleValidationErrors,
  ItemController.getItemById
);

// POST /api/items - Create new item
router.post(
  '/',
  createItemValidation,
  handleValidationErrors,
  ItemController.createItem
);

// PUT /api/items/:id - Update existing item
router.put(
  '/:id',
  idParamValidation,
  updateItemValidation,
  handleValidationErrors,
  ItemController.updateItem
);

// DELETE /api/items/:id - Delete item
router.delete(
  '/:id',
  idParamValidation,
  handleValidationErrors,
  ItemController.deleteItem
);

module.exports = router;