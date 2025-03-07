const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
require('dotenv').config();
const invoiceRoutes = require('./routes/invoices');
const productRoutes = require('./routes/products');
const db = require('./models/db');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/login/', (request, response) => {
    const { username, password } = request.body;
    
    const selectUserQuery = `SELECT * FROM user WHERE username = ?`;
    
    db.get(selectUserQuery, [username], (err, dbUser) => {
        if (err) {
            return response.status(500).send('Database error');
        }
        if (!dbUser) {
            return response.status(400).send('Invalid user');
        }

        bcrypt.compare(password, dbUser.password, (err, isPasswordMatched) => {
            if (err) {
                return response.status(500).send('Error comparing passwords');
            }
            if (!isPasswordMatched) {
                return response.status(400).send('Invalid password');
            }

            const payload = { username: username };
            const jwtToken = jwt.sign(payload, process.env.JWT_SECRET || 'abcd', { expiresIn: '1h' });
            response.send({ jwtToken });
        });
    });
});

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers['authorization'];

    if (authHeader !== undefined) {
        jwtToken = authHeader.split(' ')[1];
    }

    if (jwtToken === undefined) {
        return response.status(401).send('Invalid JWT Token');
    }

    jwt.verify(jwtToken, process.env.JWT_SECRET || 'abcd', (error, payload) => {
        if (error) {
            return response.status(401).send('Invalid JWT Token');
        } else {
            request.username = payload.username;
            next();
        }
    });
};

const insertSampleData = () => {
    db.get("SELECT COUNT(*) AS count FROM invoices", (err, row) => {
        if (err) {
            console.error("Error checking invoices table:", err.message);
            return;
        }
        if (row.count === 0) {
            db.run(
                `INSERT INTO invoices (store_name, order_id, date, quantity, regular_price, deal_price, item_total, item_tax, grand_total)
                 VALUES 
                 ('ABC Store', 'ORD001', '2025-03-06', 2, 100, 90, 180, 10, 190),
                 ('XYZ Mart', 'ORD002', '2025-03-07', 5, 120, 100, 500, 20, 520)`,
                (err) => {
                    if (err) console.error("Error inserting invoices:", err.message);
                    else console.log("Inserted sample invoices.");
                }
            );
        }
    });

    db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
        if (err) {
            console.error("Error checking products table:", err.message);
            return;
        }
        if (row.count === 0) {
            db.run(
                `INSERT INTO products (store_name, product_name, product_description, price)
                 VALUES 
                 ('ABC Store', 'Laptop', 'Gaming Laptop', 1500),
                 ('XYZ Mart', 'Headphones', 'Noise Cancelling Headphones', 200)`,
                (err) => {
                    if (err) console.error("Error inserting products:", err.message);
                    else console.log("Inserted sample products.");
                }
            );
        }
    });
};

insertSampleData();

app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
