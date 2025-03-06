const express = require('express');
const db = require('../models/db');
const router = express.Router();

// 1. Create an Invoice
router.post('/', (req, res) => {
  const { store_name, order_id, date, quantity, regular_price, deal_price, item_total, item_tax, grand_total } = req.body;

  db.run(
    `INSERT INTO invoices (store_name, order_id, date, quantity, regular_price, deal_price, item_total, item_tax, grand_total) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [store_name, order_id, date, quantity, regular_price, deal_price, item_total, item_tax, grand_total],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// 2. Get All Invoices
router.get('/', (req, res) => {
  db.all('SELECT * FROM invoices', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 3. Get Invoice by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM invoices WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    row ? res.json(row) : res.status(404).json({ message: 'Invoice not found' });
  });
});

// 4. Update an Invoice
router.put('/:id', (req, res) => {
  const { store_name, order_id, date, quantity, regular_price, deal_price, item_total, item_tax, grand_total } = req.body;

  db.run(
    `UPDATE invoices SET store_name=?, order_id=?, date=?, quantity=?, regular_price=?, deal_price=?, item_total=?, item_tax=?, grand_total=? 
     WHERE id=?`,
    [store_name, order_id, date, quantity, regular_price, deal_price, item_total, item_tax, grand_total, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// 5. Delete an Invoice
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM invoices WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
