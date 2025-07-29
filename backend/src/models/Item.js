const { v4: uuidv4 } = require('uuid');

class Item {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.description = data.description || '';
    this.status = data.status || 'active';
    this.priority = data.priority || 'medium';
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Validate item data
  static validate(data) {
    const errors = [];

    if (!data.title || typeof data.title !== 'string') {
      errors.push({ field: 'title', message: 'Title is required and must be a string' });
    } else if (data.title.length < 1 || data.title.length > 100) {
      errors.push({ field: 'title', message: 'Title must be between 1 and 100 characters' });
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' });
    } else if (data.description && data.description.length > 500) {
      errors.push({ field: 'description', message: 'Description must be less than 500 characters' });
    }

    if (data.status && !['active', 'inactive', 'archived'].includes(data.status)) {
      errors.push({ field: 'status', message: 'Status must be one of: active, inactive, archived' });
    }

    if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
      errors.push({ field: 'priority', message: 'Priority must be one of: low, medium, high' });
    }

    if (data.tags !== undefined && !Array.isArray(data.tags)) {
      errors.push({ field: 'tags', message: 'Tags must be an array' });
    } else if (data.tags && !data.tags.every(tag => typeof tag === 'string')) {
      errors.push({ field: 'tags', message: 'All tags must be strings' });
    }

    return errors;
  }

  // Update item with new data
  update(data) {
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.status !== undefined) this.status = data.status;
    if (data.priority !== undefined) this.priority = data.priority;
    if (data.tags !== undefined) this.tags = data.tags;
    this.updatedAt = new Date().toISOString();
  }

  // Convert to plain object
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
}

module.exports = Item;