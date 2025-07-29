const Item = require('../models/Item');
const FileUtils = require('../utils/fileUtils');
const { createError, asyncHandler } = require('../middleware/errorHandler');

/**
 * Item Controller
 * Handles all CRUD operations for items
 */

/**
 * GET /api/items
 * Get all items with optional filtering, search, and pagination
 */
const getItems = asyncHandler(async (req, res) => {
  const options = {
    status: req.query.status,
    priority: req.query.priority,
    search: req.query.search,
    page: req.query.page,
    limit: req.query.limit
  };

  const result = await FileUtils.getItems(options);

  res.json({
    success: true,
    data: result
  });
});

/**
 * GET /api/items/:id
 * Get a specific item by ID
 */
const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const item = await FileUtils.getItemById(id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'ITEM_NOT_FOUND',
        message: `Item with id '${id}' not found`
      }
    });
  }

  res.json({
    success: true,
    data: item
  });
});

/**
 * POST /api/items
 * Create a new item
 */
const createItem = asyncHandler(async (req, res) => {
  const { title, description, status, priority, tags } = req.body;

  // Additional validation using the Item model
  const validationErrors = Item.validate(req.body);
  if (validationErrors.length > 0) {
    throw createError(400, 'Validation failed', 'VALIDATION_ERROR');
  }

  const newItem = new Item({
    title,
    description,
    status,
    priority,
    tags
  });

  const savedItem = await FileUtils.addItem(newItem.toJSON());

  res.status(201).json({
    success: true,
    data: savedItem
  });
});

/**
 * PUT /api/items/:id
 * Update an existing item
 */
const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Check if item exists
  const existingItem = await FileUtils.getItemById(id);
  if (!existingItem) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'ITEM_NOT_FOUND',
        message: `Item with id '${id}' not found`
      }
    });
  }

  // Create updated item instance for validation
  const updatedData = { ...existingItem, ...updates };
  const validationErrors = Item.validate(updatedData);
  if (validationErrors.length > 0) {
    throw createError(400, 'Validation failed', 'VALIDATION_ERROR');
  }

  // Update the item
  const item = new Item(existingItem);
  item.update(updates);

  const savedItem = await FileUtils.updateItem(id, item.toJSON());

  res.json({
    success: true,
    data: savedItem
  });
});

/**
 * DELETE /api/items/:id
 * Delete an item
 */
const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if item exists
  const existingItem = await FileUtils.getItemById(id);
  if (!existingItem) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'ITEM_NOT_FOUND',
        message: `Item with id '${id}' not found`
      }
    });
  }

  const deleted = await FileUtils.deleteItem(id);
  
  if (!deleted) {
    throw createError(500, 'Failed to delete item', 'DELETE_FAILED');
  }

  res.json({
    success: true,
    message: 'Item deleted successfully'
  });
});

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};