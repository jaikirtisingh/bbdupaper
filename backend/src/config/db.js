const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default database structure
const defaultSchema = {
  universities: [],
  colleges: [],
  courses: [],
  branches: [],
  subjects: [],
  resources: [],
  users: [],
  announcements: [],
  stats: {
    totalDownloads: 0,
    totalViews: 0
  }
};

class JsonDB {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultSchema, null, 2), 'utf-8');
    }
  }

  read() {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading JSON DB, fallback to default:', err);
      return defaultSchema;
    }
  }

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('Error writing to JSON DB:', err);
      return false;
    }
  }

  getCollection(name) {
    const db = this.read();
    return db[name] || [];
  }

  setCollection(name, items) {
    const db = this.read();
    db[name] = items;
    this.write(db);
    return items;
  }

  findById(collectionName, id) {
    const items = this.getCollection(collectionName);
    return items.find((item) => item.id === id);
  }

  insert(collectionName, item) {
    const items = this.getCollection(collectionName);
    items.push(item);
    this.setCollection(collectionName, items);
    return item;
  }

  updateById(collectionName, id, updates) {
    const items = this.getCollection(collectionName);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
    this.setCollection(collectionName, items);
    return items[index];
  }

  deleteById(collectionName, id) {
    const items = this.getCollection(collectionName);
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    this.setCollection(collectionName, filtered);
    return true;
  }
}

const db = new JsonDB();

module.exports = db;
