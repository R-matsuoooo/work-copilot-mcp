const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/items.json');

class FileUtils {
  // Read data from JSON file
  static async readData() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, create default structure
        const defaultData = {
          items: [],
          metadata: {
            lastUpdated: new Date().toISOString(),
            version: 1
          }
        };
        await this.writeData(defaultData);
        return defaultData;
      }
      throw error;
    }
  }

  // Write data to JSON file
  static async writeData(data) {
    try {
      // Update metadata
      data.metadata = {
        ...data.metadata,
        lastUpdated: new Date().toISOString()
      };

      // Ensure directory exists
      const dir = path.dirname(DATA_FILE);
      await fs.mkdir(dir, { recursive: true });

      // Write file with pretty formatting
      await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      throw new Error(`Failed to write data: ${error.message}`);
    }
  }

  // Get all items
  static async getAllItems() {
    const data = await this.readData();
    return data.items;
  }

  // Get item by ID
  static async getItemById(id) {
    const items = await this.getAllItems();
    return items.find(item => item.id === id);
  }

  // Add new item
  static async addItem(item) {
    const data = await this.readData();
    data.items.push(item);
    await this.writeData(data);
    return item;
  }

  // Update existing item
  static async updateItem(id, updatedItem) {
    const data = await this.readData();
    const index = data.items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }

    data.items[index] = updatedItem;
    await this.writeData(data);
    return updatedItem;
  }

  // Delete item
  static async deleteItem(id) {
    const data = await this.readData();
    const index = data.items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return false;
    }

    data.items.splice(index, 1);
    await this.writeData(data);
    return true;
  }

  // Search items
  static async searchItems(query, filters = {}) {
    let items = await this.getAllItems();

    // Text search in title and description
    if (query) {
      const searchTerm = query.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by status
    if (filters.status) {
      items = items.filter(item => item.status === filters.status);
    }

    // Filter by priority
    if (filters.priority) {
      items = items.filter(item => item.priority === filters.priority);
    }

    return items;
  }

  // Paginate items
  static paginateItems(items, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);
    
    return {
      items: paginatedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: items.length,
        totalPages: Math.ceil(items.length / limit)
      }
    };
  }
}

module.exports = FileUtils;