const express = require('express');
const products = express.Router();
const productsSchema = require('./productsSchema');

products.post('/add_products_mongo', async (req, res) => {
    try {
        const productDataArray = req.body;
        if (productDataArray && productDataArray.length > 0) {
            for (const productData of productDataArray) {
                const { id, title, price, description, category, image, rating } = productData;
                const newProduct = new productsSchema({
                    id,
                    title,
                    price,
                    description,
                    category,
                    image,
                    rating,
                });
                await newProduct.save();
            }
            return res.json({ added: true });
        } else {
            return res.status(400).json({ error: 'No products data provided' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error saving products to the database' });
    }
});

products.post('/delete_products_mongo', async (req, res) => {
    try {
        await productsSchema.deleteMany({});
        return res.json({ deleted: true });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting products from the database' });
    }
});


products.get('/search_products_mongo', async (req, res) => {
    try {
        const allProducts = await productsSchema.find().maxTimeMS(30000);;
        return res.json(allProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error searching products in the database' });
    }
});

module.exports = products;
