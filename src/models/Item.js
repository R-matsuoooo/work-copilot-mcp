const { v4: uuidv4 } = require('uuid');

/**
 * Item Data Model
 * Based on the approved design specification
 */
class Item {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status !== undefined ? data.status : 'active'; // active, inactive, archived
    this.priority = data.priority !== undefined ? data.priority : 'medium'; // low, medium, high
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  /**
   * Update item with new data
   */
  update(data) {
    const allowedFields = ['title', 'description', 'status', 'priority', 'tags'];
    
    allowedFields.forEach(field => {
      if (data.hasOwnProperty(field)) {
        this[field] = data[field];
      }
    });
    
    this.updatedAt = new Date().toISOString();
    return this;
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Validate item data
   */
  static validate(data) {
    const errors = [];

    // Title validation
    if (!data.title || typeof data.title !== 'string') {
      errors.push({ field: 'title', message: 'Title is required and must be a string' });
    } else if (data.title.length < 1 || data.title.length > 100) {
      errors.push({ field: 'title', message: 'Title must be between 1 and 100 characters' });
    }

    // Description validation
    if (data.description && typeof data.description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' });
    } else if (data.description && data.description.length > 500) {
      errors.push({ field: 'description', message: 'Description must not exceed 500 characters' });
    }

    // Status validation
    if (data.status && !['active', 'inactive', 'archived'].includes(data.status)) {
      errors.push({ field: 'status', message: 'Status must be one of: active, inactive, archived' });
    }

    // Priority validation
    if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
      errors.push({ field: 'priority', message: 'Priority must be one of: low, medium, high' });
    }

    // Tags validation
    if (data.tags && !Array.isArray(data.tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array' });
    } else if (data.tags && !data.tags.every(tag => typeof tag === 'string')) {
      errors.push({ field: 'tags', message: 'All tags must be strings' });
    }

    return errors;
  }
}

module.exports = Item;