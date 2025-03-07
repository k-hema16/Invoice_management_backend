const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/db.sqlite', sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

module.exports = db;
