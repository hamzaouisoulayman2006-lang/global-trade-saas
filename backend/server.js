const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import your database model
const Product = require('./productModel');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection with detailed error logging
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// 1. Home Route (Fixes the "Cannot GET /" screen)
app.get('/', (req, res) => {
    res.send('GlobalTrade SaaS Backend is Live!');
});

// 2. GET Route (Fetch all products)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.error('GET Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// 3. POST Route (Add a product)
app.post('/api/products', async (req, res) => {
    try {
        const { name, priceCNY, imageUrl } = req.body;
        
        if (!name || !priceCNY) {
            return res.status(400).json({ error: 'Name and price are required' });
        }

        const newProduct = new Product({ name, priceCNY, imageUrl });
        const savedProduct = await newProduct.save();
        
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error('POST Error:', err.message);
        res.status(500).json({ error: 'Failed to save product' });
    }
});

// 4. DELETE Route (Remove a product)
app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        console.error('DELETE Error:', err.message);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Vercel Serverless Export Configuration
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;