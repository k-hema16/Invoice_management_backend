const express = require('express');
const db = require('../models/db');
const router = express.Router();

// 1. Create a Product
router.post('/', (req, res) => {
  const { store_name, product_name, product_description, price } = req.body;

  db.run(
    `INSERT INTO products (store_name, product_name, product_description, price) 
     VALUES (?, ?, ?, ?)`,
    [store_name, product_name, product_description, price],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// 2. Get All Products
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 3. Get Product by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    row ? res.json(row) : res.status(404).json({ message: 'Product not found' });
  });
});

// 4. Update a Product
router.put('/:id', (req, res) => {
  const { store_name, product_name, product_description, price } = req.body;

  db.run(
    `UPDATE products SET store_name=?, product_name=?, product_description=?, price=? WHERE id=?`,
    [store_name, product_name, product_description, price, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// 5. Delete a Product
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
