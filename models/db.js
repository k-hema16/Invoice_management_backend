const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../database/db.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT,
    order_id TEXT UNIQUE,
    date TEXT,
    quantity INTEGER,
    regular_price REAL,
    deal_price REAL,
    item_total REAL,
    item_tax REAL,
    grand_total REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT,
    product_name TEXT,
    product_description TEXT,
    price REAL
  )`);
});

module.exports = db;
