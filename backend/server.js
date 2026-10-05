require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./productModel');

const app = express();

// 🚨 CRITICAL: These two lines allow your server to read the JSON sent from React
app.use(cors());
app.use(express.json());

// 1. Connect to Database
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Fails fast if network blocks it
})
.then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
.catch((err) => console.error('❌ Database connection error:', err.message));

// 2. GET Route (Fetch products)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error('GET Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// 3. POST Route (Add a product)
// 3. POST Route (Add a product)
app.post('/api/products', async (req, res) => {
    try {
        // Grab the name, price, AND imageUrl from the React request
        const { name, priceCNY, imageUrl } = req.body; 
        
        if (!name || !priceCNY) {
            return res.status(400).json({ error: 'Name and price are required' });
        }

        // Save all three to the database
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
// 4. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});