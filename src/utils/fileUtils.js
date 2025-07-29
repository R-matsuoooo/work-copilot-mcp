const fs = require('fs').promises;
const path = require('path');

const DATA_FILE_PATH = path.join(__dirname, '../../data/items.json');

/**
 * File-based data persistence utilities
 */
class FileUtils {
  /**
   * Read data from JSON file
   */
  static async readData() {
    try {
      const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, create initial structure
        const initialData = {
          items: [],
          metadata: {
            lastUpdated: new Date().toISOString(),
            version: 1
          }
        };
        await this.writeData(initialData);
        return initialData;
      }
      throw error;
    }
  }

  /**
   * Write data to JSON file
   */
  static async writeData(data) {
    try {
      data.metadata.lastUpdated = new Date().toISOString();
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(DATA_FILE_PATH, jsonData, 'utf8');
      return true;
    } catch (error) {
      throw new Error(`Failed to write data: ${error.message}`);
    }
  }

  /**
   * Get all items with optional filtering and pagination
   */
  static async getItems(options = {}) {
    const data = await this.readData();
    let items = data.items;

    // Apply filters
    if (options.status) {
      items = items.filter(item => item.status === options.status);
    }

    if (options.priority) {
      items = items.filter(item => item.priority === options.priority);
    }

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const page = parseInt(options.page) || 1;
    const limit = Math.min(parseInt(options.limit) || 10, 100);
    const offset = (page - 1) * limit;

    const total = items.length;
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get item by ID
   */
  static async getItemById(id) {
    const data = await this.readData();
    return data.items.find(item => item.id === id);
  }

  /**
   * Add new item
   */
  static async addItem(item) {
    const data = await this.readData();
    data.items.push(item);
    await this.writeData(data);
    return item;
  }

  /**
   * Update existing item
   */
  static async updateItem(id, updates) {
    const data = await this.readData();
    const itemIndex = data.items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return null;
    }

    data.items[itemIndex] = { ...data.items[itemIndex], ...updates };
    await this.writeData(data);
    return data.items[itemIndex];
  }

  /**
   * Delete item by ID
   */
  static async deleteItem(id) {
    const data = await this.readData();
    const itemIndex = data.items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return false;
    }

    data.items.splice(itemIndex, 1);
    await this.writeData(data);
    return true;
  }
}

module.exports = FileUtils;