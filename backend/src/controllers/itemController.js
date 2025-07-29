const Item = require('../models/Item');
const FileUtils = require('../utils/fileUtils');

class ItemController {
  // GET /api/items - Get all items with optional filtering and pagination
  static async getAllItems(req, res, next) {
    try {
      const { page = 1, limit = 10, search, status, priority } = req.query;
      
      // Search and filter items
      const items = await FileUtils.searchItems(search, { status, priority });
      
      // Paginate results
      const result = FileUtils.paginateItems(items, page, limit);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/items/:id - Get item by ID
  static async getItemById(req, res, next) {
    try {
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
    } catch (error) {
      next(error);
    }
  }

  // POST /api/items - Create new item
  static async createItem(req, res, next) {
    try {
      // Validate input data using Item model
      const validationErrors = Item.validate(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: validationErrors
          }
        });
      }
      
      // Create new item
      const newItem = new Item(req.body);
      const savedItem = await FileUtils.addItem(newItem.toJSON());
      
      res.status(201).json({
        success: true,
        data: savedItem
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/items/:id - Update existing item
  static async updateItem(req, res, next) {
    try {
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
      
      // Validate input data
      const validationErrors = Item.validate({ ...existingItem, ...req.body });
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: validationErrors
          }
        });
      }
      
      // Update item
      const itemToUpdate = new Item(existingItem);
      itemToUpdate.update(req.body);
      
      const updatedItem = await FileUtils.updateItem(id, itemToUpdate.toJSON());
      
      res.json({
        success: true,
        data: updatedItem
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/items/:id - Delete item
  static async deleteItem(req, res, next) {
    try {
      const { id } = req.params;
      
      const deleted = await FileUtils.deleteItem(id);
      
      if (!deleted) {
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
        message: 'Item deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ItemController;