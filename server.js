const express = require('express');
const cors = require('cors');
require('dotenv').config();
const invoiceRoutes = require('./routes/invoices');
const productRoutes = require('./routes/products');
const db = require('./models/db');

const app = express();
app.use(cors());
app.use(express.json());

// Insert sample data if tables are empty
db.serialize(() => {
  db.get("SELECT COUNT(*) AS count FROM invoices", (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO invoices (store_name, order_id, date, quantity, regular_price, deal_price, item_total, item_tax, grand_total)
              VALUES 
              ('ABC Store', 'ORD001', '2025-03-06', 2, 100, 90, 180, 10, 190),
              ('XYZ Mart', 'ORD002', '2025-03-07', 5, 120, 100, 500, 20, 520)`);
      console.log("Inserted sample invoices.");
    }
  });

  db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO products (store_name, product_name, product_description, price)
              VALUES 
              ('ABC Store', 'Laptop', 'Gaming Laptop', 1500),
              ('XYZ Mart', 'Headphones', 'Noise Cancelling Headphones', 200)`);
      console.log("Inserted sample products.");
    }
  });
});

app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
